import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { TopBar } from '../../ui/TopBar';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';

import { useI18n } from '../../i18n/I18nContext';

import {
  getAudioSettings,
  setAudioSettings,
  speakText,
  stopTTS,
  type AudioSettings,
  type TTSSpeed,
} from '../../audio';

type Props = { onBack: () => void };

export function ParentAudioSettingsScreen({ onBack }: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';

  const [settings, setSettingsState] = useState<AudioSettings>(() => getAudioSettings());

  useEffect(() => {
    return () => {
      stopTTS();
    };
  }, []);

  function patch(p: Partial<AudioSettings>) {
    const next = setAudioSettings(p);
    setSettingsState(next);
  }

  function testSpeak() {
    stopTTS();
    speakText(t('parent.audio.sampleText'));
  }

  const speedLabel = useMemo(
    () => (s: TTSSpeed) =>
      s === 'slow' ? t('parent.audio.speedSlow') : t('parent.audio.speedNormal'),
    [t]
  );

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <TopBar
        title={t('parent.audio.title')}
        onBack={onBack}
        backLabel={t('parent.common.back')}
        dir={dir}
      />

      <Text style={{ opacity: 0.75, marginTop: 10 }}>
        {t('parent.home.audioSubtitle')}
      </Text>

      <View style={{ marginTop: 12 }}>
        <Card>
          <Text style={{ fontWeight: '900', marginBottom: 8 }}>
            {t('parent.audio.ttsTitle')}
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: isRtl ? 'flex-end' : 'flex-start' }}>
            <View style={{ marginEnd: 10, marginBottom: 10 }}>
              <Button
                variant={settings.ttsEnabled ? 'primary' : 'secondary'}
                onClick={() => patch({ ttsEnabled: true })}
              >
                {t('parent.audio.on')}
              </Button>
            </View>

            <View style={{ marginEnd: 10, marginBottom: 10 }}>
              <Button
                variant={!settings.ttsEnabled ? 'primary' : 'secondary'}
                onClick={() => patch({ ttsEnabled: false })}
              >
                {t('parent.audio.off')}
              </Button>
            </View>
          </View>
        </Card>

        <View style={{ height: 12 }} />

        <Card>
          <Text style={{ fontWeight: '900', marginBottom: 8 }}>
            {t('parent.audio.speedTitle')}
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: isRtl ? 'flex-end' : 'flex-start' }}>
            <View style={{ marginEnd: 10, marginBottom: 10 }}>
              <Button
                variant={settings.ttsSpeed === 'slow' ? 'primary' : 'secondary'}
                onClick={() => patch({ ttsSpeed: 'slow' })}
              >
                {speedLabel('slow')}
              </Button>
            </View>

            <View style={{ marginEnd: 10, marginBottom: 10 }}>
              <Button
                variant={settings.ttsSpeed === 'normal' ? 'primary' : 'secondary'}
                onClick={() => patch({ ttsSpeed: 'normal' })}
              >
                {speedLabel('normal')}
              </Button>
            </View>
          </View>
        </Card>

        <View style={{ height: 12 }} />

        <Card>
          <Text style={{ fontWeight: '900', marginBottom: 8 }}>
            {t('parent.audio.fxTitle')}
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: isRtl ? 'flex-end' : 'flex-start' }}>
            <View style={{ marginEnd: 10, marginBottom: 10 }}>
              <Button
                variant={settings.fxEnabled ? 'primary' : 'secondary'}
                onClick={() => patch({ fxEnabled: true })}
              >
                {t('parent.audio.on')}
              </Button>
            </View>

            <View style={{ marginEnd: 10, marginBottom: 10 }}>
              <Button
                variant={!settings.fxEnabled ? 'primary' : 'secondary'}
                onClick={() => patch({ fxEnabled: false })}
              >
                {t('parent.audio.off')}
              </Button>
            </View>
          </View>
        </Card>

        <View style={{ height: 12 }} />

        <Button onClick={testSpeak}>{t('parent.audio.testButton')}</Button>
      </View>
    </ScrollView>
  );
}
