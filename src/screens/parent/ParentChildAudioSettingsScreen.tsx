// src/screens/parent/ParentChildAudioSettingsScreen.tsx (Native)
import { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
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
type VoiceOption = { id?: string; label: string; lang?: string };

// ---------- Optional native speech bridge (expo-speech) ----------
type ExpoSpeechLike = {
  speak?: (text: string, options?: any) => void;
  stop?: () => void;
  getAvailableVoicesAsync?: () => Promise<any[]>;
};

function tryGetExpoSpeech(): ExpoSpeechLike | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('expo-speech');
    return (mod?.default ?? mod) as ExpoSpeechLike;
  } catch {
    return null;
  }
}

function clampLabel(s: string, max = 36) {
  if (!s) return '';
  return s.length > max ? `${s.slice(0, max)}…` : s;
}

function scoreVoice(opt: VoiceOption) {
  if (!opt.id) return 1000;
  const label = (opt.label ?? '').toLowerCase();
  const lang = (opt.lang ?? '').toLowerCase();

  if (lang.startsWith('en')) return 900;
  if (label.includes('english')) return 880;
  if (label.includes('local')) return 820;
  if (label.includes('network')) return 810;
  return 500;
}

export function ParentChildAudioSettingsScreen({
  child,
  onBack,
  onChildUpdated,
}: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';
  const { toast, showToast, clearToast } = useToast(1600);

  const expo = useMemo(() => tryGetExpoSpeech(), []);

  const [mode, setMode] = useState<'global' | 'override'>(
    child.audioProfile?.mode === 'override' ? 'override' : 'global'
  );

  const [override, setOverride] = useState<ChildOverride>(
    child.audioProfile?.override ?? {}
  );

  // Voices
  const [webVoices, setWebVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [nativeVoices, setNativeVoices] = useState<any[]>([]);
  const [voicesLoading, setVoicesLoading] = useState(false);

  // Modal picker
  const [voicesOpen, setVoicesOpen] = useState(false);
  const [pendingVoiceId, setPendingVoiceId] = useState<string | null>(null);

  function stopAllSpeech() {
    try {
      stopTTS();
    } catch {
      // ignore
    }
    try {
      expo?.stop?.();
    } catch {
      // ignore
    }
  }

  // Stop ongoing speech when leaving this screen
  useEffect(() => {
    return () => {
      stopAllSpeech();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const speedLabel = useMemo(
    () => (s: TTSSpeed) =>
      s === 'slow' ? t('parent.audio.speedSlow') : t('parent.audio.speedNormal'),
    [t]
  );

  // -------------------------
  // Voices loading + options
  // -------------------------

  // Web voices
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const w = globalThis as any;
    const synth: SpeechSynthesis | undefined = w?.speechSynthesis;
    if (!synth?.getVoices) return;

    const read = () => {
      try {
        const v = synth.getVoices?.() ?? [];
        setWebVoices(v);
      } catch {
        setWebVoices([]);
      }
    };

    read();
    synth.onvoiceschanged = read;
    return () => {
      try {
        synth.onvoiceschanged = null;
      } catch {
        // ignore
      }
    };
  }, []);

  async function refreshNativeVoices() {
    if (Platform.OS === 'web') return;
    if (!expo?.getAvailableVoicesAsync) {
      setNativeVoices([]);
      return;
    }

    setVoicesLoading(true);
    try {
      const v = await expo.getAvailableVoicesAsync();
      setNativeVoices(Array.isArray(v) ? v : []);
    } catch {
      setNativeVoices([]);
    } finally {
      setVoicesLoading(false);
    }
  }

  useEffect(() => {
    if (Platform.OS === 'web') return;
    void refreshNativeVoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const voiceOptionsAll: VoiceOption[] = useMemo(() => {
    const opts: VoiceOption[] = [
      { id: undefined, label: t('parent.audio.voiceAuto'), lang: '' },
    ];

    if (Platform.OS === 'web') {
      const uniq = new Map<string, SpeechSynthesisVoice>();
      for (const v of webVoices) {
        const id = (v as any)?.voiceURI || v.name;
        if (!id) continue;
        if (!uniq.has(id)) uniq.set(id, v);
      }

      for (const [id, v] of uniq.entries()) {
        const lang = v.lang ? String(v.lang) : "";
        if (lang && !lang.toLowerCase().startsWith("en")) continue;
        const langLabel = lang ? ` (${lang})` : "";
        opts.push({ id, label: `${v.name}${langLabel}`, lang });
      }

      return opts
        .slice(0, 1)
        .concat(opts.slice(1).sort((a, b) => scoreVoice(b) - scoreVoice(a)));
    }

    const uniqNative = new Map<string, any>();
    for (const v of nativeVoices) {
      const id =
        v?.identifier ??
        v?.id ??
        v?.voiceURI ??
        v?.name ??
        v?.language ??
        null;
      if (!id) continue;
      if (!uniqNative.has(String(id))) uniqNative.set(String(id), v);
    }

for (const [id, v] of uniqNative.entries()) {
  const name = v?.name ?? v?.identifier ?? v?.id ?? id;
  const lang = v?.language ? String(v.language) : '';
  if (lang && !lang.toLowerCase().startsWith('en')) continue;

  const langLabel = lang ? ` (${lang})` : '';
  opts.push({ id, label: `${String(name)}${langLabel}`, lang });
}


    return opts
      .slice(0, 1)
      .concat(opts.slice(1).sort((a, b) => scoreVoice(b) - scoreVoice(a)));
  }, [t, webVoices, nativeVoices]);

  const voiceOptionsRecommended = useMemo(() => voiceOptionsAll.slice(0, 18), [
    voiceOptionsAll,
  ]);

  const selectedVoiceLabel = useMemo(() => {
    const id = effective.voiceId ?? undefined;
    const found = voiceOptionsAll.find((v) => (v.id ?? undefined) === id);
    return found?.label ?? t('parent.audio.voiceAuto');
  }, [effective.voiceId, voiceOptionsAll, t]);

  // -------------------------
  // Preview + Picker actions
  // -------------------------

  function previewVoice(voiceId: string | null) {
    stopAllSpeech();
    const text = "Hello! Let's learn English.";
    const rate = effective.ttsSpeed === 'slow' ? 0.8 : 1.0;

    // Native: use expo-speech for preview so voice selection works
    if (Platform.OS !== 'web' && expo?.speak) {
      try {
        expo.speak(text, {
          rate,
          pitch: 1.0,
          voice: voiceId ?? undefined,
          language: "en-US",
        });
        return;
      } catch {
        // fallthrough
      }
    }

    // Web fallback: use our audio layer (2 args max)
    try {
      speakText(text);
    } catch {
      // ignore
    }
  }

  function testSpeak() {
    previewVoice((effective.voiceId ?? null) as any);
  }

  function openVoicePicker() {
    setPendingVoiceId((effective.voiceId ?? null) as any);
    setVoicesOpen(true);
  }

  function closeVoicePicker() {
    stopAllSpeech();
    setVoicesOpen(false);
  }

  function confirmVoicePicker() {
    if (mode === 'global') {
      closeVoicePicker();
      return;
    }
    patchOverride({ voiceId: pendingVoiceId ?? undefined });
    closeVoicePicker();
  }

  return (
    <>
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

          {/* Voice */}
          <Card>
            <Text style={{ fontWeight: '900', marginBottom: 8 }}>
              {t('parent.audio.voiceTitle')}
            </Text>

            <View style={{ marginBottom: 10 }}>
              <Button
                variant="secondary"
                onClick={openVoicePicker}
                disabled={mode === 'global'}
              >
                {clampLabel(selectedVoiceLabel, 40)}
              </Button>
            </View>

            <Text style={{ opacity: 0.7, fontSize: 13 }}>
              {t('parent.audio.voiceHint')}
            </Text>

            {mode === 'global' ? (
              <Text style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
                {t('parent.childAudio.disabledBecauseGlobal')}
              </Text>
            ) : null}

            {Platform.OS !== 'web' && !expo ? (
              <Text style={{ opacity: 0.7, fontSize: 13, marginTop: 6 }}>
                (Native) expo-speech not installed. Install it to get voice list.
              </Text>
            ) : null}
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

          {/* Actions */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Button onClick={testSpeak}>{t('parent.audio.testButton')}</Button>
            </View>
            <View style={{ flex: 1 }}>
              <Button variant="secondary" onClick={stopAllSpeech}>
                Stop
              </Button>
            </View>
          </View>

          <View style={{ height: 10 }} />

          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, marginEnd: 10 }}>
              <Button variant="secondary" onClick={resetToGlobalDefaults}>
                {t('parent.childAudio.resetButton')}
              </Button>
            </View>
            <View style={{ flex: 1 }}>
              <Button variant="primary" onClick={save}>
                {t('parent.childAudio.saveButton')}
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Voice picker modal */}
      <Modal
        visible={voicesOpen}
        animationType="slide"
        onRequestClose={closeVoicePicker}
      >
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={{ padding: 16, paddingBottom: 10 }}>
            <TopBar
              title={t('parent.audio.voiceTitle')}
              onBack={closeVoicePicker}
              backLabel={t('parent.common.back')}
              dir={dir}
            />

            <View
              style={{
                marginTop: 10,
                flexDirection: isRtl ? 'row-reverse' : 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
              }}
            >
              <Pressable
                onPress={closeVoicePicker}
                style={{ paddingVertical: 8, paddingHorizontal: 10 }}
              >
                <Text style={{ fontWeight: '800' }}>
                  {dir === 'rtl' ? 'ביטול' : 'Cancel'}
                </Text>
              </Pressable>

              <Pressable
                onPress={confirmVoicePicker}
                style={{ paddingVertical: 8, paddingHorizontal: 10 }}
              >
                <Text style={{ fontWeight: '900' }}>
                  {dir === 'rtl' ? 'אישור' : 'Confirm'}
                </Text>
              </Pressable>
            </View>

            <Text style={{ opacity: 0.7, marginTop: 6, fontSize: 13 }}>
              Tap a voice to hear a sample. Then press Confirm to save.
            </Text>

            <View style={{ marginTop: 10, flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Button
                  variant={!pendingVoiceId ? 'primary' : 'secondary'}
                  onClick={() => {
                    setPendingVoiceId(null);
                    previewVoice(null);
                  }}
                >
                  {t('parent.audio.voiceAuto')}
                </Button>
              </View>

              <View style={{ flex: 1 }}>
                <Button
                  variant="secondary"
                  onClick={() => {
                    stopAllSpeech();
                    if (Platform.OS !== 'web') void refreshNativeVoices();
                  }}
                  disabled={
                    Platform.OS === 'web' ||
                    !expo?.getAvailableVoicesAsync ||
                    voicesLoading
                  }
                >
                  {voicesLoading ? 'Refreshing…' : 'Refresh voices'}
                </Button>
              </View>
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.08)' }} />

          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
            <Text style={{ fontWeight: '900', marginBottom: 10 }}>
              Recommended
            </Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {voiceOptionsRecommended
                .filter((v) => !!v.id)
                .map((opt) => {
                  const id = String(opt.id);
                  const selected = (pendingVoiceId ?? null) === id;
                  return (
                    <View key={id} style={{ marginEnd: 10, marginBottom: 10 }}>
                      <Button
                        variant={selected ? 'primary' : 'secondary'}
                        onClick={() => {
                          setPendingVoiceId(id);
                          previewVoice(id);
                        }}
                      >
                        {clampLabel(opt.label, 30)}
                      </Button>
                    </View>
                  );
                })}
            </View>

            <View style={{ height: 16 }} />

            <Text style={{ fontWeight: '900', marginBottom: 10 }}>
              All voices
            </Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {voiceOptionsAll
                .filter((v) => !!v.id)
                .map((opt) => {
                  const id = String(opt.id);
                  const selected = (pendingVoiceId ?? null) === id;
                  return (
                    <View key={id} style={{ marginEnd: 10, marginBottom: 10 }}>
                      <Button
                        variant={selected ? 'primary' : 'secondary'}
                        onClick={() => {
                          setPendingVoiceId(id);
                          previewVoice(id);
                        }}
                      >
                        {clampLabel(opt.label, 30)}
                      </Button>
                    </View>
                  );
                })}
            </View>

            {Platform.OS !== 'web' && voiceOptionsAll.length <= 1 ? (
              <Text style={{ opacity: 0.7, marginTop: 10 }}>
                No voices were returned by expo-speech. Try “Refresh voices”.
              </Text>
            ) : null}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}
