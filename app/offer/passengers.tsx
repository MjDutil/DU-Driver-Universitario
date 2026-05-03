import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { AuthLayout } from '../../src/components/AuthLayout';
import { Button } from '../../src/components/Button';
import { useOfferStore } from '../../src/store/useOfferStore';
import { colors, typography, spacing, radius } from '../../src/theme/tokens';

const MIN = 1;
const MAX = 6;

export default function PassengersScreen() {
  const router = useRouter();
  const { draft, setDraft } = useOfferStore();
  const n = draft.passageiros;

  return (
    <AuthLayout
      title="Quantas vagas?"
      subtitle="Defina o número de passageiros que podem entrar na carona."
      step={5}
      totalSteps={6}
    >
      <View style={styles.counter}>
        <TouchableOpacity
          style={[styles.btn, n <= MIN && styles.btnDisabled]}
          onPress={() => n > MIN && setDraft({ passageiros: n - 1 })}
          disabled={n <= MIN}
        >
          <Feather name="minus" size={22} color={n <= MIN ? colors.border : colors.primary} />
        </TouchableOpacity>

        <View style={styles.numberBlock}>
          <Text style={styles.number}>{n}</Text>
          <Text style={styles.label}>{n === 1 ? 'passageiro' : 'passageiros'}</Text>
        </View>

        <TouchableOpacity
          style={[styles.btn, n >= MAX && styles.btnDisabled]}
          onPress={() => n < MAX && setDraft({ passageiros: n + 1 })}
          disabled={n >= MAX}
        >
          <Feather name="plus" size={22} color={n >= MAX ? colors.border : colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Visualização de assentos */}
      <View style={styles.seats}>
        {Array.from({ length: MAX }, (_, i) => (
          <View key={i} style={[styles.seat, i < n && styles.seatActive]}>
            <Feather name="user" size={18} color={i < n ? colors.primary : colors.border} />
          </View>
        ))}
      </View>

      <Button title="Continuar" onPress={() => router.push('/offer/price')} />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
    paddingVertical: spacing.lg,
  },
  btn: {
    width: 52, height: 52, borderRadius: 26,
    borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  btnDisabled: { borderColor: colors.border, opacity: 0.4 },
  numberBlock: { alignItems: 'center', gap: spacing.xxs, minWidth: 80 },
  number: {
    fontFamily: typography.fonts.heading,
    fontSize: 56,
    fontWeight: typography.weights.extrabold,
    color: colors.ink,
    lineHeight: 64,
  },
  label: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.inkMuted,
  },
  seats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  seat: {
    width: 44, height: 44, borderRadius: radius.sm,
    borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  seatActive: {
    borderColor: colors.primaryLight,
    backgroundColor: colors.primaryLight,
  },
});
