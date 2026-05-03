import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MockMotorista } from '../mocks/data';
import { Avatar } from './Avatar';
import { StarRating } from './StarRating';
import { colors, typography, spacing, radius, shadows } from '../theme/tokens';

type DriverCardProps = {
  driver: MockMotorista;
  onPress: (driver: MockMotorista) => void;
};

export function DriverCard({ driver, onPress }: DriverCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(driver)}
      activeOpacity={0.85}
    >
      <Avatar uri={driver.foto} size="md" name={driver.nome} />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{driver.nome}</Text>
        <StarRating rating={driver.avaliacao} size={12} />
        <View style={styles.destinoRow}>
          <Feather name="map-pin" size={12} color={colors.inkSubtle} />
          <Text style={styles.destino} numberOfLines={1}>{driver.destino}</Text>
        </View>
      </View>

      <View style={styles.priceCol}>
        <Text style={styles.price}>
          R$ {driver.valor.toFixed(2).replace('.', ',')}
        </Text>
        <Text style={styles.priceLabel}>por vaga</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.card,
  },
  info: {
    flex: 1,
    gap: spacing.xxs,
  },
  name: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
    color: colors.ink,
  },
  destinoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  destino: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.inkSubtle,
    flex: 1,
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  price: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h2,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  priceLabel: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.label,
    color: colors.inkSubtle,
  },
});
