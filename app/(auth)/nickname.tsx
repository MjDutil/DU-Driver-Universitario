import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { AuthLayout } from '../../src/components/AuthLayout';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function NicknameScreen() {
  const router = useRouter();
  const setDraft = useAuthStore((s) => s.setDraft);
  const apelido = useAuthStore((s) => s.draft.apelido);
  const [error, setError] = useState('');

  function handleContinue() {
    if (!apelido.trim()) {
      setError('Informe como prefere ser chamado(a)');
      return;
    }
    setError('');
    router.push('/(auth)/contact');
  }

  return (
    <AuthLayout
      title="Como podemos te chamar?"
      subtitle="Pode ser seu apelido, nome do meio — o que preferir."
      step={3}
      totalSteps={7}
    >
      <Input
        label="Apelido / nome preferido"
        placeholder="Ex: Maju"
        value={apelido}
        onChangeText={(t) => { setDraft({ apelido: t }); setError(''); }}
        autoCapitalize="words"
        error={error}
      />
      <Button title="Continuar" onPress={handleContinue} />
    </AuthLayout>
  );
}
