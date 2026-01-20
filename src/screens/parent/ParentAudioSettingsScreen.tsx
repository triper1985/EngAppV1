// src/screens/parent/ParentAudioSettingsScreen.tsx
import { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

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

  // Prefer English-ish first
  if (lang.startsWith('en')) return 900;
  if (label.includes('english')) return 880;

  // Prefer local/network a bit higher than random
  if (label.includes('local')) return 820;
  if (label.includes('network')) return 810;

  return 500;
}

export function ParentAudioSettingsScreen({ onBack }: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';

  const expo = useMemo(() => tryGetExpoSpeech(), []);

  const [settings, setSettingsState] = useState<AudioSettings>(() =>
    getAudioSettings()
  );

  // Web voices
  const [webVoices, setWebVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Native voices (expo-speech)
  const [nativeVoices, setNativeVoices] = useState<any[]>([]);
  const [voicesLoading, setVoicesLoading] = useState(false);

  // Modal picker
  const [voicesOpen, setVoicesOpen] = useState(false);
  const [pendingVoiceId, setPendingVoiceId] = useState<string | null>(
    (settings.voiceId ?? null) as any
  );

  // ✅ stop any ongoing TTS when leaving this screen
  useEffect(() => {
    return () => {
      stopAllSpeech();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  function patch(p: Partial<AudioSettings>) {
    const next = setAudioSettings(p);
    setSettingsState(next);
  }

  const speedLabel = useMemo(
    () => (s: TTSSpeed) =>
      s === 'slow' ? t('parent.audio.speedSlow') : t('parent.audio.speedNormal'),
    [t]
  );

  // ---------- Load voices (Web) ----------
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
        const lang = v.lang ? String(v.lang) : '';
        const langLabel = lang ? ` (${lang})` : '';
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
      const name = v?.name ?? v?.identifier ?? id;
      const lang = v?.language ? String(v.language) : '';
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
    const id = settings.voiceId ?? undefined;
    const found = voiceOptionsAll.find((v) => (v.id ?? undefined) === id);
    return found?.label ?? t('parent.audio.voiceAuto');
  }, [settings.voiceId, voiceOptionsAll, t]);

  function previewVoice(voiceId: string | null) {
    stopAllSpeech();
    const text = t('parent.audio.sampleText');
    const rate = settings.ttsSpeed === 'slow' ? 0.8 : 1.0;

    // Native: expo-speech preview (voice selection works)
    if (Platform.OS !== 'web' && expo?.speak) {
      try {
        expo.speak(text, {
          rate,
          pitch: 1.0,
          voice: voiceId ?? undefined,
        });
        return;
      } catch {
        // fallthrough
      }
    }

    // Web: our audio layer (1-2 args only)
    try {
      speakText(text);
    } catch {
      // ignore
    }
  }

  function testSpeak() {
    previewVoice((settings.voiceId ?? null) as any);
  }

  function openVoicePicker() {
    setPendingVoiceId((settings.voiceId ?? null) as any);
    setVoicesOpen(true);
  }

  function closeVoicePicker() {
    stopAllSpeech();
    setVoicesOpen(false);
  }

  function confirmVoicePicker() {
    patch({ voiceId: pendingVoiceId ?? undefined });
    closeVoicePicker();
  }

  return (
    <>
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

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: isRtl ? 'flex-end' : 'flex-start',
              }}
            >
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

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: isRtl ? 'flex-end' : 'flex-start',
              }}
            >
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
              {t('parent.audio.voiceTitle')}
            </Text>

            <View style={{ marginBottom: 10 }}>
              <Button variant="secondary" onClick={openVoicePicker}>
                {clampLabel(selectedVoiceLabel, 40)}
              </Button>
            </View>

            <Text style={{ opacity: 0.7, fontSize: 13 }}>
              {t('parent.audio.voiceHint')}
            </Text>

            {Platform.OS !== 'web' && !expo ? (
              <Text style={{ opacity: 0.7, fontSize: 13, marginTop: 6 }}>
                (Native) expo-speech not installed. Install it to get voice list.
              </Text>
            ) : null}
          </Card>

          <View style={{ height: 12 }} />

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
