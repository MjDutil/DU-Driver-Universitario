import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { AuthLayout } from '../../src/components/AuthLayout';
import { useOfferStore } from '../../src/store/useOfferStore';
import { colors, typography, spacing, radius, shadows } from '../../src/theme/tokens';

const CORES = [
  { nome: 'Branco',     hex: '#FFFFFF' },
  { nome: 'Prata',      hex: '#C0C0C0' },
  { nome: 'Preto',      hex: '#1A1A1A' },
  { nome: 'Cinza',      hex: '#808080' },
  { nome: 'Vermelho',   hex: '#CC0000' },
  { nome: 'Azul',       hex: '#1565C0' },
  { nome: 'Azul Claro', hex: '#42A5F5' },
  { nome: 'Verde',      hex: '#2E7D32' },
  { nome: 'Amarelo',    hex: '#F9A825' },
  { nome: 'Laranja',    hex: '#E65100' },
  { nome: 'Marrom',     hex: '#5D4037' },
  { nome: 'Bege',       hex: '#F5F0DC' },
  { nome: 'Dourado',    hex: '#CFB53B' },
  { nome: 'Rosa',       hex: '#F06292' },
  { nome: 'Vinho',      hex: '#880E4F' },
];

const LIGHT_COLORS = ['#FFFFFF', '#F5F0DC', '#C0C0C0', '#42A5F5', '#F9A825'];

export default function ColorPickerScreen() {
  const router = useRouter();
  const { draft, setDraft } = useOfferStore();

  function select(nome: string) {
    setDraft({ cor: nome });
    router.back();
  }

  return (
    <AuthLayout title="Cor do carro" subtitle="Selecione a cor do seu veículo." step={2} totalSteps={6}>
      <FlatList
        data={CORES}
        keyExtractor={(item) => item.nome}
        numColumns={3}
        scrollEnabled={false}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => {
          const selected = draft.cor === item.nome;
          const isLight = LIGHT_COLORS.includes(item.hex);
          return (
            <TouchableOpacity
              style={[styles.card, selected && styles.cardSelected]}
              onPress={() => select(item.nome)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.circle,
                  { backgroundColor: item.hex },
                  isLight && styles.circleBorder,
                ]}
              >
                {selected && (
                  <Feather name="check" size={16} color={isLight ? colors.ink : colors.white} />
                )}
              </View>
              <Text style={[styles.label, selected && styles.labelSelected]} numberOfLines={1}>
                {item.nome}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  grid: { gap: spacing.sm },
  row: { gap: spacing.sm },
  card: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
    gap: spacing.xs,
    ...shadows.card,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBorder: {
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  label: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.inkMuted,
    textAlign: 'center',
  },
  labelSelected: {
    color: colors.primaryDark,
    fontWeight: typography.weights.semibold,
  },
});
