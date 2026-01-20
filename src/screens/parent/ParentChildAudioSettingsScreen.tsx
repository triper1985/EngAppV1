// src/screens/parent/ParentChildAudioSettingsScreen.tsx (Native)
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { ChildProfile } from '../../types';

import { TopBar } from '../../ui/TopBar';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useToast } from '../../ui/useToast';

import { useI18n } from '../../i18n/I18nContext';

import {
  getEffectiveAudioSettings,
  speakText,
  stopTTS,
  type AudioSettings,
  type TTSSpeed,
} from '../../audio';

import { ChildrenStore } from '../../storage/childrenStore';

type Props = {
  child: ChildProfile;
  onBack: () => void;
  onChildUpdated: (updated: ChildProfile) => void;
};

type ChildOverride = NonNullable<ChildProfile['audioProfile']>['override'];

export function ParentChildAudioSettingsScreen({
  child,
  onBack,
  onChildUpdated,
}: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';
  const { toast, showToast, clearToast } = useToast(1600);

  const [mode, setMode] = useState<'global' | 'override'>(
    child.audioProfile?.mode === 'override' ? 'override' : 'global'
  );

  const [override, setOverride] = useState<ChildOverride>(
    child.audioProfile?.override ?? {}
  );

  // Stop ongoing speech when leaving this screen
  useEffect(() => {
    return () => {
      stopTTS();
    };
  }, []);

  const effective: AudioSettings = useMemo(() => {
    return getEffectiveAudioSettings({
      ...child,
      audioProfile: {
        mode,
        override,
      },
    });
  }, [child, mode, override]);

  function patchOverride(p: ChildOverride) {
    setOverride((prev) => ({ ...(prev ?? {}), ...(p ?? {}) }));
  }

  function save() {
    const latest = ChildrenStore.getById(child.id) ?? child;

    const updated: ChildProfile = {
      ...latest,
      audioProfile: {
        mode,
        override: mode === 'override' ? override ?? {} : undefined,
      },
    };

    const saved = ChildrenStore.upsert(updated);
    onChildUpdated(saved);
    showToast(t('parent.common.savedOk'));
  }

  function resetToGlobalDefaults() {
    setMode('global');
    setOverride({});
    showToast(t('parent.childAudio.resetOk'));
  }

  function testSpeak() {
    stopTTS();

    // Preview should reflect CURRENT UI state (even before Save)
    const latest = ChildrenStore.getById(child.id) ?? child;

    const previewChild: ChildProfile = {
      ...latest,
      audioProfile: {
        mode,
        override: mode === 'override' ? override ?? {} : undefined,
      },
    };

    speakText(t('parent.audio.sampleText'), {}, previewChild);
  }

  const speedLabel = useMemo(
    () => (s: TTSSpeed) =>
      s === 'slow' ? t('parent.audio.speedSlow') : t('parent.audio.speedNormal'),
    [t]
  );

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <TopBar
        title={t('parent.childAudio.title', { name: child.name })}
        onBack={() => {
          clearToast();
          onBack();
        }}
        backLabel={t('parent.common.back')}
        dir={dir}
      />

      {/* toast (if any) */}
      {toast ? (
        <Text style={{ fontSize: 14, marginTop: 10, minHeight: 22, opacity: 0.85 }}>
          {toast}
        </Text>
      ) : (
        <View style={{ height: 22, marginTop: 10 }} />
      )}

      <View style={{ marginTop: 12 }}>
        {/* Mode */}
        <Card>
          <Text style={{ fontWeight: '900', marginBottom: 8 }}>
            {t('parent.childAudio.modeTitle')}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: isRtl ? 'flex-end' : 'flex-start',
            }}
          >
            <View style={{ marginEnd: 10, marginBottom: 10 }}>
              <Button
                variant={mode === 'global' ? 'primary' : 'secondary'}
                onClick={() => setMode('global')}
              >
                {t('parent.childAudio.modeGlobal')}
              </Button>
            </View>

            <View style={{ marginEnd: 10, marginBottom: 10 }}>
              <Button
                variant={mode === 'override' ? 'primary' : 'secondary'}
                onClick={() => setMode('override')}
              >
                {t('parent.childAudio.modeOverride')}
              </Button>
            </View>
          </View>

          <Text style={{ marginTop: 8, fontSize: 13, opacity: 0.75 }}>
            {mode === 'global'
              ? t('parent.childAudio.modeGlobalHint')
              : t('parent.childAudio.modeOverrideHint')}
          </Text>
        </Card>

        <View style={{ height: 12 }} />

        {/* Effective */}
        <Card>
          <Text style={{ fontWeight: '900', marginBottom: 8 }}>
            {t('parent.childAudio.effectiveTitle')}
          </Text>

          <View style={{ opacity: 0.8 }}>
            <Text style={{ fontSize: 13, lineHeight: 20 }}>
              {t('parent.childAudio.effective.tts')}: <Text style={{ fontWeight: '700' }}>{String(effective.ttsEnabled)}</Text>
            </Text>
            <Text style={{ fontSize: 13, lineHeight: 20 }}>
              {t('parent.childAudio.effective.speed')}: <Text style={{ fontWeight: '700' }}>{effective.ttsSpeed}</Text>
            </Text>
            <Text style={{ fontSize: 13, lineHeight: 20 }}>
              {t('parent.childAudio.effective.voice')}:{' '}
              <Text style={{ fontWeight: '700' }}>
                {effective.voiceId ?? t('parent.childAudio.voiceAuto')}
              </Text>
            </Text>
            <Text style={{ fontSize: 13, lineHeight: 20 }}>
              {t('parent.childAudio.effective.fx')}: <Text style={{ fontWeight: '700' }}>{String(effective.fxEnabled)}</Text>
            </Text>
          </View>
        </Card>

        <View style={{ height: 12 }} />

        {/* TTS */}
        <Card>
          <Text style={{ fontWeight: '900', marginBottom: 8 }}>
            {t('parent.audio.ttsTitle')}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: isRtl ? 'flex-end' : 'flex-start',
            }}
          >
            <View style={{ marginEnd: 10, marginBottom: 10 }}>
              <Button
                variant={effective.ttsEnabled ? 'primary' : 'secondary'}
                disabled={mode === 'global'}
                onClick={() => patchOverride({ ttsEnabled: true })}
              >
                {t('parent.audio.on')}
              </Button>
            </View>

            <View style={{ marginEnd: 10, marginBottom: 10 }}>
              <Button
                variant={!effective.ttsEnabled ? 'primary' : 'secondary'}
                disabled={mode === 'global'}
                onClick={() => patchOverride({ ttsEnabled: false })}
              >
                {t('parent.audio.off')}
              </Button>
            </View>
          </View>

          {mode === 'global' ? (
            <Text style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
              {t('parent.childAudio.disabledBecauseGlobal')}
            </Text>
          ) : null}
        </Card>

        <View style={{ height: 12 }} />

        {/* Speed */}
        <Card>
          <Text style={{ fontWeight: '900', marginBottom: 8 }}>
            {t('parent.audio.speedTitle')}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: isRtl ? 'flex-end' : 'flex-start',
            }}
          >
            <View style={{ marginEnd: 10, marginBottom: 10 }}>
              <Button
                variant={effective.ttsSpeed === 'slow' ? 'primary' : 'secondary'}
                disabled={mode === 'global'}
                onClick={() => patchOverride({ ttsSpeed: 'slow' })}
              >
                {speedLabel('slow')}
              </Button>
            </View>

            <View style={{ marginEnd: 10, marginBottom: 10 }}>
              <Button
                variant={effective.ttsSpeed === 'normal' ? 'primary' : 'secondary'}
                disabled={mode === 'global'}
                onClick={() => patchOverride({ ttsSpeed: 'normal' })}
              >
                {speedLabel('normal')}
              </Button>
            </View>
          </View>
        </Card>

        <View style={{ height: 12 }} />

        {/* FX */}
        <Card>
          <Text style={{ fontWeight: '900', marginBottom: 8 }}>
            {t('parent.audio.fxTitle')}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: isRtl ? 'flex-end' : 'flex-start',
            }}
          >
            <View style={{ marginEnd: 10, marginBottom: 10 }}>
              <Button
                variant={effective.fxEnabled ? 'primary' : 'secondary'}
                disabled={mode === 'global'}
                onClick={() => patchOverride({ fxEnabled: true })}
              >
                {t('parent.audio.on')}
              </Button>
            </View>

            <View style={{ marginEnd: 10, marginBottom: 10 }}>
              <Button
                variant={!effective.fxEnabled ? 'primary' : 'secondary'}
                disabled={mode === 'global'}
                onClick={() => patchOverride({ fxEnabled: false })}
              >
                {t('parent.audio.off')}
              </Button>
            </View>
          </View>
        </Card>

        <View style={{ height: 12 }} />

        {/* Actions row */}
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, marginEnd: 10 }}>
            <Button onClick={testSpeak}>{t('parent.audio.testButton')}</Button>
          </View>
          <View style={{ flex: 1 }}>
            <Button variant="secondary" onClick={resetToGlobalDefaults}>
              {t('parent.childAudio.resetButton')}
            </Button>
          </View>
        </View>

        <View style={{ height: 10 }} />

        <Button variant="primary" onClick={save}>
          {t('parent.childAudio.saveButton')}
        </Button>
      </View>
    </ScrollView>
  );
}
