import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { register } from './authApi';

type Props = {
  onGoLogin: () => void;
  onRegistered: () => void;
  onBack: () => void;
};

export function RegisterScreen({ onGoLogin, onRegistered, onBack }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setBusy(true);
    setError(null);
    const { error } = await register(email.trim(), password);
    setBusy(false);

    if (error) {
      setError(error.message);
      return;
    }
    onRegistered();
  }

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: '700' }}>Create Parent Account</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
        style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Password"
        style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
      />

      {error ? <Text style={{ color: 'crimson' }}>{error}</Text> : null}

      <Pressable
        onPress={onSubmit}
        disabled={busy}
        style={{
          paddingVertical: 12,
          borderRadius: 12,
          borderWidth: 1,
          alignItems: 'center',
          opacity: busy ? 0.6 : 1,
        }}
      >
        <Text>{busy ? 'Creating…' : 'Create Account'}</Text>
      </Pressable>

      <Pressable onPress={onGoLogin} style={{ paddingVertical: 8 }}>
        <Text style={{ textDecorationLine: 'underline' }}>Back to login</Text>
      </Pressable>

      <Pressable onPress={onBack} style={{ paddingVertical: 8 }}>
        <Text style={{ textDecorationLine: 'underline' }}>Back</Text>
      </Pressable>
    </View>
  );
}
