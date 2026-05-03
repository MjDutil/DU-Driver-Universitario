import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { AuthLayout } from '../../src/components/AuthLayout';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { Badge } from '../../src/components/Badge';
import { useOfferStore } from '../../src/store/useOfferStore';
import { useAppStore } from '../../src/store/useAppStore';
import { colors, typography, spacing, radius } from '../../src/theme/tokens';

function sugerirValor(passageiros: number): string {
  const base = 6 + passageiros * 0.5;
  return base.toFixed(2).replace('.', ',');
}

export default function PriceScreen() {
  const router = useRouter();
  const { draft, setDraft, resetDraft } = useOfferStore();
  const user = useAppStore((s) => s.user);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!draft.valor) {
      setDraft({ valor: sugerirValor(draft.passageiros) });
    }
  }, []);

  function handlePublish() {
    const num = parseFloat(draft.valor.replace(',', '.'));
    if (isNaN(num) || num <= 0) { setError('Informe um valor válido'); return; }

    const finish = () => { resetDraft(); router.replace('/(tabs)'); };

    if (Platform.OS === 'web') {
      window.alert(`Carona publicada!\nSua oferta foi registrada.\n${draft.passageiros} vagas · R$ ${draft.valor} por passageiro`);
      finish();
    } else {
      Alert.alert(
        'Carona publicada!',
        `Sua oferta foi registrada.\n${draft.passageiros} vagas · R$ ${draft.valor} por passageiro`,
        [{ text: 'OK', onPress: finish }]
      );
    }
  }

  return (
    <AuthLayout
      title="Valor da carona"
      subtitle="Definimos um valor sugerido com base na rota e número de passageiros."
      step={6}
      totalSteps={6}
    >
      <View style={styles.suggestRow}>
        <Feather name="zap" size={16} color={colors.warning} />
        <Text style={styles.suggestText}>
          Valor sugerido: R$ {sugerirValor(draft.passageiros)} por vaga
        </Text>
        <Badge label="Auto" variant="warning" />
      </View>

      <Input
        label="Valor por passageiro (R$)"
        placeholder="Ex: 8,00"
        value={draft.valor}
        onChangeText={(t) => { setDraft({ valor: t }); setError(''); }}
        keyboardType="decimal-pad"
        error={error}
      />

      {/* Resumo */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Resumo da oferta</Text>
        <SummaryRow icon="map-pin" label="Rota" value={`${draft.origem} → ${draft.destino}`} />
        <SummaryRow icon="calendar" label="Datas" value={`${draft.datas.length} dia(s) selecionado(s)`} />
        <SummaryRow icon="users" label="Vagas" value={`${draft.passageiros} passageiro(s)`} />
        <SummaryRow icon="truck" label="Carro" value={`${draft.marca} ${draft.modelo} · ${draft.cor}`} />
      </View>

      {user?.tratamento === 'Sra' && (
        <View style={styles.generoAviso}>
          <Feather name="shield" size={14} color={colors.primary} />
          <Text style={styles.generoAvisoText}>
            Sua oferta será sugerida preferencialmente para passageiras mulheres
          </Text>
        </View>
      )}

      <Button title="Publicar carona" onPress={handlePublish} />
      <Button title="Cancelar" variant="ghost" onPress={() => { resetDraft(); router.replace('/(tabs)'); }} />
    </AuthLayout>
  );
}

function SummaryRow({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Feather name={icon} size={14} color={colors.primary} />
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  suggestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#FFF3E0',
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  suggestText: {
    flex: 1,
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.warning,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  summaryTitle: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.semibold,
    color: colors.inkMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xxs,
  },
  generoAviso: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  generoAvisoText: {
    flex: 1,
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.primaryDark,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  rowLabel: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.inkSubtle,
    width: 52,
  },
  rowValue: {
    flex: 1,
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.ink,
    fontWeight: typography.weights.medium,
  },
});
