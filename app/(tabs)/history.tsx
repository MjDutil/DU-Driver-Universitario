import React from 'react';
import { View, Text, FlatList, StyleSheet, ListRenderItemInfo } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { mockHistorico, MockHistoricoItem } from '../../src/mocks/data';
import { StarRating } from '../../src/components/StarRating';
import { colors, typography, spacing, radius, shadows } from '../../src/theme/tokens';

function HistoricoCard({ item }: { item: MockHistoricoItem }) {
  const isPassageiro = item.tipo === 'passageiro';
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.typeBadge, isPassageiro ? styles.badgePassageiro : styles.badgeMotorista]}>
          <Feather
            name={isPassageiro ? 'arrow-up-right' : 'arrow-down-left'}
            size={12}
            color={isPassageiro ? colors.primary : colors.success}
          />
          <Text style={[styles.typeText, isPassageiro ? styles.typeTextPrimary : styles.typeTextSuccess]}>
            {isPassageiro ? 'Carona' : 'Oferta'}
          </Text>
        </View>
        <Text style={styles.valor}>R$ {item.valor.toFixed(2).replace('.', ',')}</Text>
      </View>

      <Text style={styles.outro}>{item.outro}</Text>

      <View style={styles.cardFooter}>
        <View style={styles.destinoRow}>
          <Feather name="map-pin" size={12} color={colors.inkSubtle} />
          <Text style={styles.destino}>{item.destino}</Text>
        </View>
        <StarRating rating={item.avaliacao} size={12} />
      </View>
    </View>
  );
}

export default function HistoryScreen() {
  function renderItem({ item }: ListRenderItemInfo<MockHistoricoItem>) {
    return <HistoricoCard item={item} />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico</Text>
        <Text style={styles.sub}>{mockHistorico.length} caronas realizadas</Text>
      </View>

      {mockHistorico.length > 0 ? (
        <FlatList
          data={mockHistorico}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.empty}>
          <Feather name="clock" size={48} color={colors.border} />
          <Text style={styles.emptyTitle}>Nenhuma carona ainda</Text>
          <Text style={styles.emptySub}>Suas caronas realizadas aparecerão aqui.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.xxs,
  },
  title: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h1,
    fontWeight: typography.weights.bold,
    color: colors.ink,
  },
  sub: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.inkSubtle,
  },
  list: { padding: spacing.md, gap: spacing.sm },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.card,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  typeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xxs,
    paddingHorizontal: spacing.xs, paddingVertical: spacing.xxs,
    borderRadius: radius.pill,
  },
  badgePassageiro: { backgroundColor: colors.primaryLight },
  badgeMotorista: { backgroundColor: '#D6F5E4' },
  typeText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.label,
    fontWeight: typography.weights.semibold,
  },
  typeTextPrimary: { color: colors.primaryDark },
  typeTextSuccess: { color: colors.success },
  valor: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h2,
    fontWeight: typography.weights.bold,
    color: colors.ink,
  },
  outro: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
    color: colors.ink,
  },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  destinoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs, flex: 1 },
  destino: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.inkSubtle,
    flex: 1,
  },
  empty: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, paddingHorizontal: spacing.xxl,
  },
  emptyTitle: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h2,
    fontWeight: typography.weights.bold,
    color: colors.ink,
  },
  emptySub: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.inkMuted,
    textAlign: 'center',
  },
});
