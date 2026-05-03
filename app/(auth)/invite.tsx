import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { AuthLayout } from '../../src/components/AuthLayout';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';

export default function InviteScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  function handleContinue() {
    if (!code.trim()) {
      setError('Insira o código de convite');
      return;
    }
    setError('');
    router.push('/(auth)/name');
  }

  return (
    <AuthLayout
      title="Bem-vindo ao DU"
      subtitle="Insira o código de convite que você recebeu para começar."
      step={1}
      totalSteps={7}
    >
      <Input
        label="Código de convite"
        placeholder="Ex: DU-2024"
        value={code}
        onChangeText={(t) => { setCode(t); setError(''); }}
        autoCapitalize="characters"
        error={error}
      />
      <Button title="Continuar" onPress={handleContinue} />
    </AuthLayout>
  );
}
