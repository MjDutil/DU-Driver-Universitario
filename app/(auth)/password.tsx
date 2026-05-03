import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthLayout } from '../../src/components/AuthLayout';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useAppStore } from '../../src/store/useAppStore';
import { colors, typography, spacing } from '../../src/theme/tokens';

export default function PasswordScreen() {
  const router = useRouter();
  const draft = useAuthStore((s) => s.draft);
  const setDraft = useAuthStore((s) => s.setDraft);
  const setUser = useAppStore((s) => s.setUser);

  const [code, setCode] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ code: '', password: '', confirm: '' });

  function validate() {
    const e = { code: '', password: '', confirm: '' };
    if (!code.trim()) e.code = 'Insira o código de verificação';
    if (!draft.senha || draft.senha.length < 6) e.password = 'Mínimo de 6 caracteres';
    if (draft.senha !== confirmPassword) e.confirm = 'As senhas não coincidem';
    return e;
  }

  function handleFinish() {
    const e = validate();
    if (e.code || e.password || e.confirm) { setErrors(e); return; }

    setUser({
      id: 'u_new',
      nome: draft.nome,
      apelido: draft.apelido,
      cidade: '',
      instituicao: '',
      foto: `https://i.pravatar.cc/150?u=${draft.email}`,
      tratamento: draft.tratamento || undefined,
    });

    router.replace('/(profile)/setup');
  }

  return (
    <AuthLayout
      title="Verificação e senha"
      subtitle="Confirme o código que enviamos e crie sua senha."
      step={7}
      totalSteps={7}
    >
      <Input
        label="Código de verificação"
        placeholder="Ex: 123456"
        value={code}
        onChangeText={(t) => { setCode(t); setErrors((e) => ({ ...e, code: '' })); }}
        keyboardType="number-pad"
        error={errors.code}
      />

      <View style={styles.hint}>
        <Text style={styles.hintText}>
          Código enviado para {draft.celular || draft.email}
        </Text>
      </View>

      <Input
        label="Criar senha"
        placeholder="Mínimo 6 caracteres"
        value={draft.senha}
        onChangeText={(t) => { setDraft({ senha: t }); setErrors((e) => ({ ...e, password: '' })); }}
        secureTextEntry
        error={errors.password}
      />
      <Input
        label="Confirmar senha"
        placeholder="Repita a senha"
        value={confirmPassword}
        onChangeText={(t) => { setConfirmPassword(t); setErrors((e) => ({ ...e, confirm: '' })); }}
        secureTextEntry
        error={errors.confirm}
      />

      <Button title="Confirmar e criar conta" onPress={handleFinish} />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  hint: {
    marginTop: -spacing.xs,
  },
  hintText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.inkSubtle,
  },
});
