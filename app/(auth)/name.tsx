import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { AuthLayout } from '../../src/components/AuthLayout';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function NameScreen() {
  const router = useRouter();
  const setDraft = useAuthStore((s) => s.setDraft);
  const nome = useAuthStore((s) => s.draft.nome);
  const [error, setError] = useState('');

  function handleContinue() {
    if (!nome.trim()) {
      setError('Informe seu nome completo');
      return;
    }
    setError('');
    router.push('/(auth)/nickname');
  }

  return (
    <AuthLayout title="Seu nome" step={2} totalSteps={7}>
      <Input
        label="Nome completo"
        placeholder="Ex: Maria Julia Silva"
        value={nome}
        onChangeText={(t) => { setDraft({ nome: t }); setError(''); }}
        autoCapitalize="words"
        error={error}
      />
      <Button title="Continuar" onPress={handleContinue} />
    </AuthLayout>
  );
}
