// src/ParentGate.tsx
import { useMemo, useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { verifyParentPin } from './parentPin';
import { Button } from './ui/Button';
import { TopBar } from './ui/TopBar';
import { useI18n } from './i18n/I18nContext';




type Props = {
  parentId: string;          // ✅ חובה – PIN הוא per parentId
  parentEmail?: string;
  onExit: () => void;
  onUnlocked: () => void;
};

const MAX_ATTEMPTS = 3;

function clampDigitsOnly(s: string) {
  return (s ?? '').replace(/[^\d]/g, '').slice(0, 8);
}

export function ParentGate({ parentId,parentEmail, onExit, onUnlocked }: Props) {
  const { t, dir } = useI18n();

  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  const locked = useMemo(() => attempts >= MAX_ATTEMPTS, [attempts]);

async function submit() {
  setError(null);

  if (locked) {
    setError(t('parent.gate.error.tooManyAttempts'));
    return;
  }

  const clean = clampDigitsOnly(pin);
  if (clean.length < 4) {
    setError(t('parent.gate.error.minDigits'));
    return;
  }

  const ok = await verifyParentPin(parentId, clean);

  if (ok) {
    setAttempts(0);
    setPin('');
    onUnlocked();
    return;
  }

  const next = attempts + 1;
  setAttempts(next);
  const left = Math.max(0, MAX_ATTEMPTS - next);
  setError(t('parent.gate.error.wrongPin', { left: String(left) }));
}

function emailPrefix(email: string) {
  return email.split('@')[0];
}

  return (
    <View style={{ padding: 16 }}>
    <TopBar
      title={t('parent.gate.title')}
      onBack={onExit}
      backLabel={t('parent.common.back')}
      dir={dir}
    />

    {parentEmail ? (
        <Text style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>
          {(() => {
            const label = t('parent.gate.loggedInAs', {
              email: emailPrefix(parentEmail),
            });

            return label === 'parent.gate.loggedInAs'
              ? `הורה מחובר: ${emailPrefix(parentEmail)}`
              : label;
          })()}
        </Text>
    ) : null}

      <View style={{ marginTop: 16, gap: 10 }}>
        <Text style={{ fontSize: 13, opacity: 0.75 }}>
          {t('parent.gate.subtitle')}
        </Text>

        <TextInput
          value={pin}
          onChangeText={(v) => setPin(clampDigitsOnly(v))}
          placeholder="••••"
          keyboardType="number-pad"
          secureTextEntry={!showPin}
          editable={!locked}
          style={{
            fontSize: 18,
            paddingVertical: 12,
            paddingHorizontal: 12,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: '#ddd',
            opacity: locked ? 0.6 : 1,
          }}
          onSubmitEditing={submit}
          returnKeyType="done"
        />

        <Button onClick={() => setShowPin((v) => !v)} disabled={locked}>
          {showPin
            ? t('parent.gate.button.hide')
            : t('parent.gate.button.show')}
        </Button>

        {error ? (
          <Text style={{ color: '#b00020', fontSize: 13 }}>
            {error}
          </Text>
        ) : null}

        <Button
          variant="primary"
          fullWidth
          onClick={submit}
          disabled={locked}
        >
          {t('parent.gate.button.enter')}
        </Button>
      </View>
    </View>
  );
}
