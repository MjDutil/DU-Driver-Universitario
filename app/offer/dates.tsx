import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthLayout } from '../../src/components/AuthLayout';
import { Button } from '../../src/components/Button';
import { useOfferStore } from '../../src/store/useOfferStore';
import { colors, typography, spacing, radius } from '../../src/theme/tokens';

const MAX_DATAS = 10;
const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

function gerarDias(qtd = 30) {
  const hoje = new Date();
  return Array.from({ length: qtd }, (_, i) => {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() + i);
    return d;
  });
}

export default function DatesScreen() {
  const router = useRouter();
  const { draft, setDraft } = useOfferStore();
  const [error, setError] = useState('');
  const dias = gerarDias(30);

  function toggle(iso: string) {
    setError('');
    setDraft({
      datas: draft.datas.includes(iso)
        ? draft.datas.filter((d) => d !== iso)
        : draft.datas.length < MAX_DATAS
          ? [...draft.datas, iso]
          : draft.datas,
    });
  }

  function handleContinue() {
    if (draft.datas.length === 0) { setError('Selecione pelo menos uma data'); return; }
    router.push('/offer/passengers');
  }

  return (
    <AuthLayout
      title="Escolha as datas"
      subtitle={`Selecione até ${MAX_DATAS} dias para oferecer a carona.`}
      step={4}
      totalSteps={6}
    >
      <FlatList
        data={dias}
        keyExtractor={(d) => d.toISOString().split('T')[0]}
        numColumns={5}
        scrollEnabled={false}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        renderItem={({ item: d }) => {
          const iso = d.toISOString().split('T')[0];
          const sel = draft.datas.includes(iso);
          const isHoje = d.toDateString() === new Date().toDateString();
          return (
            <TouchableOpacity
              style={[styles.dayBtn, sel && styles.dayBtnActive]}
              onPress={() => toggle(iso)}
              activeOpacity={0.7}
            >
              <Text style={[styles.dayWeek, sel && styles.dayWeekActive]}>
                {DIAS_SEMANA[d.getDay()]}
              </Text>
              <Text style={[styles.dayNum, sel && styles.dayNumActive]}>
                {d.getDate()}
              </Text>
              <Text style={[styles.dayMonth, sel && styles.dayMonthActive]}>
                {MESES[d.getMonth()]}
              </Text>
              {isHoje && <View style={[styles.todayDot, sel && styles.todayDotActive]} />}
            </TouchableOpacity>
          );
        }}
      />

      {draft.datas.length > 0 && (
        <Text style={styles.counter}>
          {draft.datas.length}/{MAX_DATAS} dias selecionados
        </Text>
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Continuar" onPress={handleContinue} />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  grid: { gap: spacing.xs },
  row: { gap: spacing.xs },
  dayBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
    gap: 2,
  },
  dayBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayWeek: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.label,
    color: colors.inkSubtle,
  },
  dayWeekActive: { color: 'rgba(255,255,255,0.8)' },
  dayNum: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h2,
    fontWeight: typography.weights.bold,
    color: colors.ink,
  },
  dayNumActive: { color: colors.white },
  dayMonth: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.label,
    color: colors.inkSubtle,
  },
  dayMonthActive: { color: 'rgba(255,255,255,0.8)' },
  todayDot: {
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: colors.primary, marginTop: 2,
  },
  todayDotActive: { backgroundColor: colors.white },
  counter: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.inkMuted,
    textAlign: 'center',
  },
  error: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.error,
    textAlign: 'center',
  },
});
