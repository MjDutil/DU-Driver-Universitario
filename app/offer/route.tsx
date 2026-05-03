import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { AuthLayout } from '../../src/components/AuthLayout';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { useOfferStore } from '../../src/store/useOfferStore';
import { colors, typography, spacing, radius } from '../../src/theme/tokens';

export default function RouteScreen() {
  const router = useRouter();
  const { draft, setDraft } = useOfferStore();
  const [errors, setErrors] = useState({ origem: '', destino: '' });

  function handleContinue() {
    const e = { origem: '', destino: '' };
    if (!draft.origem.trim()) e.origem = 'Informe o ponto de saída';
    if (!draft.destino.trim()) e.destino = 'Informe o destino';
    if (e.origem || e.destino) { setErrors(e); return; }
    router.push('/offer/dates');
  }

  return (
    <AuthLayout title="Rota da carona" subtitle="De onde você vai sair e para onde vai?" step={3} totalSteps={6}>
      <Input
        label="De onde vai sair?"
        placeholder="Ex: Rua das Flores, 100 — Mooca"
        value={draft.origem}
        onChangeText={(t) => { setDraft({ origem: t }); setErrors((e) => ({ ...e, origem: '' })); }}
        autoCapitalize="words"
        error={errors.origem}
      />

      <View style={styles.connector}>
        <View style={styles.line} />
        <Feather name="arrow-down" size={16} color={colors.inkSubtle} />
        <View style={styles.line} />
      </View>

      <Input
        label="Para onde vai?"
        placeholder="Ex: USP Leste — Av. Aricanduva"
        value={draft.destino}
        onChangeText={(t) => { setDraft({ destino: t }); setErrors((e) => ({ ...e, destino: '' })); }}
        autoCapitalize="words"
        error={errors.destino}
      />

      {draft.origem && draft.destino && (
        <View style={styles.previewCard}>
          <View style={styles.previewRow}>
            <View style={styles.dotGreen} />
            <Text style={styles.previewText} numberOfLines={1}>{draft.origem}</Text>
          </View>
          <View style={styles.previewDivider} />
          <View style={styles.previewRow}>
            <Feather name="map-pin" size={12} color={colors.primary} />
            <Text style={styles.previewText} numberOfLines={1}>{draft.destino}</Text>
          </View>
        </View>
      )}

      <Button title="Continuar" onPress={handleContinue} />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  connector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    marginVertical: -spacing.xs,
  },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  previewCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  dotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.success },
  previewText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.inkMuted,
    flex: 1,
  },
  previewDivider: { height: 1, backgroundColor: colors.border, marginLeft: spacing.lg },
});
