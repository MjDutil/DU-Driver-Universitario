import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { AuthLayout } from '../../src/components/AuthLayout';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { useOfferStore } from '../../src/store/useOfferStore';

export default function DriverDataScreen() {
  const router = useRouter();
  const { draft, setDraft } = useOfferStore();
  const [error, setError] = useState('');

  function handleContinue() {
    if (!draft.cnh.trim()) { setError('Informe o número da CNH'); return; }
    setError('');
    router.push('/offer/car-data');
  }

  return (
    <AuthLayout title="Dados do motorista" step={1} totalSteps={6}>
      <Input
        label="Número de registro CNH"
        placeholder="Ex: 12345678900"
        value={draft.cnh}
        onChangeText={(t) => { setDraft({ cnh: t }); setError(''); }}
        keyboardType="number-pad"
        error={error}
      />
      <Button title="Continuar" onPress={handleContinue} />
    </AuthLayout>
  );
}
