import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { AuthLayout } from '../../src/components/AuthLayout';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function ContactScreen() {
  const router = useRouter();
  const setDraft = useAuthStore((s) => s.setDraft);
  const draft = useAuthStore((s) => s.draft);
  const [errors, setErrors] = useState({ celular: '', email: '' });

  function validate() {
    const e = { celular: '', email: '' };
    if (!draft.celular.trim()) e.celular = 'Informe seu celular';
    else if (!/^\d{10,11}$/.test(draft.celular.replace(/\D/g, '')))
      e.celular = 'Número inválido';
    if (!draft.email.trim()) e.email = 'Informe seu e-mail';
    else if (!draft.email.includes('@')) e.email = 'E-mail inválido';
    return e;
  }

  function handleContinue() {
    const e = validate();
    if (e.celular || e.email) { setErrors(e); return; }
    setErrors({ celular: '', email: '' });
    router.push('/(auth)/treatment');
  }

  return (
    <AuthLayout
      title="Seu contato"
      subtitle="Usaremos para verificar sua conta."
      step={4}
      totalSteps={7}
    >
      <Input
        label="Número de celular"
        placeholder="(11) 99999-9999"
        value={draft.celular}
        onChangeText={(t) => { setDraft({ celular: t }); setErrors((e) => ({ ...e, celular: '' })); }}
        keyboardType="phone-pad"
        error={errors.celular}
      />
      <Input
        label="E-mail institucional"
        placeholder="voce@usp.br"
        value={draft.email}
        onChangeText={(t) => { setDraft({ email: t }); setErrors((e) => ({ ...e, email: '' })); }}
        keyboardType="email-address"
        error={errors.email}
      />
      <Button title="Continuar" onPress={handleContinue} />
    </AuthLayout>
  );
}
