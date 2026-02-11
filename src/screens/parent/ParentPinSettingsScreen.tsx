// src/screens/parent/ParentPinSettingsScreen.tsx
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Text, TextInput } from 'react-native';

import { TopBar } from '../../ui/TopBar';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useI18n } from '../../i18n/I18nContext';

import {
  hasParentPin,
  verifyParentPin,
  setParentPin,
  resetParentPin,
} from '../../parentPin';

import { useAuth } from '../auth/AuthProvider';


type Props = {
  onBack: () => void;
};

const DEFAULT_PIN = '1234';

function normalizeDigits(v: string) {
  return String(v ?? '').replace(/\D/g, '').slice(0, 8);
}

export function ParentPinSettingsScreen({ onBack }: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';
  const { session } = useAuth();
  const parentId = session?.user?.id ?? null;


  const [loading, setLoading] = useState(true);
  const [pinExists, setPinExists] = useState(false);

  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  if (!parentId) return;

  let alive = true;
  (async () => {
    try {
      const exists = await hasParentPin(parentId);
      if (!alive) return;
      setPinExists(exists);
    } finally {
      if (alive) setLoading(false);
    }
  })();

  return () => {
    alive = false;
  };
}, [parentId]);


  useEffect(() => {
    if (!toast) return;
    const tt = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(tt);
  }, [toast]);

  const canSet = useMemo(() => {
    const a = normalizeDigits(newPin);
    const b = normalizeDigits(confirmPin);
    const cur = normalizeDigits(currentPin);

    return a.length >= 4 && a === b && (!pinExists || cur.length >= 4);
  }, [newPin, confirmPin, pinExists, currentPin]);

async function refreshExists() {
  if (!parentId) return;
  const exists = await hasParentPin(parentId);
  setPinExists(exists);
}


  function showToast(msg: string) {
    setError(null);
    setToast(msg);
  }

  function showError(msg: string) {
    setToast(null);
    setError(msg);
  }

  async function onSubmitSet() {
    setError(null);

    const a = normalizeDigits(newPin);
    const b = normalizeDigits(confirmPin);

    if (a.length < 4) {
      showError(t('parent.pin.error.newTooShort'));
      return;
    }
    if (a !== b) {
      showError(t('parent.pin.error.confirmMismatch'));
      return;
    }

    // if pin already exists – require current pin
if (pinExists) {
  if (!parentId) return;

  const ok = await verifyParentPin(parentId, currentPin);
  if (!ok) {
    showError(t('parent.pin.error.currentWrong'));
    return;
  }
}

if (!parentId) return;

const ok = await setParentPin(parentId, a);

    if (!ok) {
      showError(t('parent.pin.error.newTooShort'));
      return;
    }

    await refreshExists();
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    showToast(t('parent.pin.toast.saved'));
  }

  async function onClear() {
    // אם אין PIN "אמיתי" – לא עושים כלום
if (!parentId) return;

const exists = await hasParentPin(parentId);
if (!exists) return;

const ok = await verifyParentPin(parentId, currentPin);
if (!ok) {
  showError(t('parent.pin.error.currentWrongToClear'));
  return;
}

await resetParentPin(parentId);

    await refreshExists();
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    showToast(t('parent.pin.toast.cleared'));
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <TopBar
        title={t('parent.pin.title')}
        onBack={onBack}
        backLabel={t('parent.common.back')}
        dir={dir}
      />

      {toast ? (
        <Text
          style={{
            fontSize: 14,
            marginTop: 10,
            minHeight: 22,
            opacity: 0.85,
            textAlign: isRtl ? 'right' : 'left',
          }}
        >
          {toast}
        </Text>
      ) : null}

      {error ? (
        <Text
          style={{
            fontSize: 13,
            marginTop: 10,
            color: '#b00020',
            textAlign: isRtl ? 'right' : 'left',
          }}
        >
          {error}
        </Text>
      ) : null}

      <View style={{ marginTop: 14 }}>
        <Card>
          <Text
            style={{
              fontWeight: '900',
              marginBottom: 10,
              textAlign: isRtl ? 'right' : 'left',
            }}
          >
            {t('parent.pin.statusTitle')}
          </Text>

          <Text style={{ opacity: 0.8, textAlign: isRtl ? 'right' : 'left' }}>
            {loading
              ? t('parent.pin.status.loading')
              : pinExists
                ? t('parent.pin.status.enabled')
                : t('parent.pin.status.disabled')}
          </Text>
        </Card>
      </View>

      <View style={{ marginTop: 14 }}>
        <Card>
          <Text
            style={{
              fontWeight: '900',
              marginBottom: 10,
              textAlign: isRtl ? 'right' : 'left',
            }}
          >
            {pinExists ? t('parent.pin.changeTitle') : t('parent.pin.setTitle')}
          </Text>

          {pinExists ? (
            <>
              <Text
                style={{
                  fontSize: 13,
                  opacity: 0.75,
                  textAlign: isRtl ? 'right' : 'left',
                }}
              >
                {t('parent.pin.currentHint')}
              </Text>

              <TextInput
                value={currentPin}
                onChangeText={(v) => setCurrentPin(normalizeDigits(v))}
                placeholder={t('parent.pin.currentPlaceholder')}
                secureTextEntry
                keyboardType="number-pad"
                style={{
                  width: '100%',
                  marginTop: 8,
                  fontSize: 16,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: 'rgba(0,0,0,0.15)',
                  textAlign: isRtl ? 'right' : 'left',
                }}
              />
            </>
          ) : null}

          <Text
            style={{
              marginTop: 12,
              fontSize: 13,
              opacity: 0.75,
              textAlign: isRtl ? 'right' : 'left',
            }}
          >
            {t('parent.pin.newHint')}
          </Text>

          <TextInput
            value={newPin}
            onChangeText={(v) => setNewPin(normalizeDigits(v))}
            placeholder={t('parent.pin.newPlaceholder')}
            secureTextEntry
            keyboardType="number-pad"
            style={{
              width: '100%',
              marginTop: 8,
              fontSize: 16,
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.15)',
              textAlign: isRtl ? 'right' : 'left',
            }}
          />

          <Text
            style={{
              marginTop: 12,
              fontSize: 13,
              opacity: 0.75,
              textAlign: isRtl ? 'right' : 'left',
            }}
          >
            {t('parent.pin.confirmHint')}
          </Text>

          <TextInput
            value={confirmPin}
            onChangeText={(v) => setConfirmPin(normalizeDigits(v))}
            placeholder={t('parent.pin.confirmPlaceholder')}
            secureTextEntry
            keyboardType="number-pad"
            style={{
              width: '100%',
              marginTop: 8,
              fontSize: 16,
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.15)',
              textAlign: isRtl ? 'right' : 'left',
            }}
          />

          {/* Buttons */}
          <View
            style={{
              flexDirection: isRtl ? 'row-reverse' : 'row',
              gap: 10,
              marginTop: 14,
            }}
          >
            <View style={{ flex: 1 }}>
              <Button fullWidth variant="secondary" onClick={onClear} disabled={!pinExists}>
                {t('parent.pin.clear')}
              </Button>
            </View>

            <View style={{ flex: 1 }}>
              <Button fullWidth variant="primary" onClick={onSubmitSet} disabled={!canSet}>
                {pinExists ? t('parent.pin.saveChange') : t('parent.pin.save')}
              </Button>
            </View>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}
