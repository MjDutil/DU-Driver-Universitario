import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { AuthLayout } from '../../src/components/AuthLayout';
import { Button } from '../../src/components/Button';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Tratamento } from '../../src/mocks/data';
import { colors, typography, spacing, radius, shadows } from '../../src/theme/tokens';

const OPCOES: { value: Tratamento; label: string; sub: string; icon: React.ComponentProps<typeof Feather>['name'] }[] = [
  { value: 'Sr',               label: 'Sr.',              sub: 'ele / dele',        icon: 'user' },
  { value: 'Sra',              label: 'Sra.',             sub: 'ela / dela',        icon: 'user' },
  { value: 'Prefiro não falar', label: 'Prefiro não informar', sub: 'sem preferência', icon: 'minus-circle' },
];

export default function TreatmentScreen() {
  const router = useRouter();
  const { draft, setDraft } = useAuthStore();
  const [error, setError] = useState('');

  function select(value: Tratamento) {
    setDraft({ tratamento: value });
    setError('');
  }

  function handleContinue() {
    if (!draft.tratamento) { setError('Selecione uma opção para continuar'); return; }
    router.push('/(auth)/birthdate');
  }

  return (
    <AuthLayout
      title="Como prefere ser chamado?"
      subtitle="Essa informação ajuda a conectar você com caronas compatíveis."
      step={5}
      totalSteps={7}
    >
      <View style={styles.options}>
        {OPCOES.map((op) => {
          const active = draft.tratamento === op.value;
          return (
            <TouchableOpacity
              key={op.value}
              style={[styles.card, active && styles.cardActive]}
              onPress={() => select(op.value)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
                <Feather name={op.icon} size={22} color={active ? colors.white : colors.primary} />
              </View>
              <View style={styles.cardText}>
                <Text style={[styles.cardLabel, active && styles.cardLabelActive]}>{op.label}</Text>
                <Text style={[styles.cardSub, active && styles.cardSubActive]}>{op.sub}</Text>
              </View>
              <View style={[styles.radio, active && styles.radioActive]}>
                {active && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Continuar" onPress={handleContinue} />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  options: { gap: spacing.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
    ...shadows.card,
  },
  cardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  iconWrap: {
    width: 44, height: 44, borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: colors.primary,
  },
  cardText: { flex: 1, gap: 2 },
  cardLabel: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    color: colors.ink,
  },
  cardLabelActive: { color: colors.primaryDark },
  cardSub: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.inkSubtle,
  },
  cardSubActive: { color: colors.primary },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: colors.primary },
  radioDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: colors.primary,
  },
  error: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.error,
    textAlign: 'center',
  },
});
