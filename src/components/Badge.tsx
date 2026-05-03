import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radius } from '../theme/tokens';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error';

const VARIANT: Record<BadgeVariant, { bg: string; text: string }> = {
  default: { bg: colors.surface, text: colors.inkMuted },
  success: { bg: '#D6F5E4', text: colors.success },
  warning: { bg: '#FFF3E0', text: colors.warning },
  error: { bg: '#FFE5E4', text: colors.error },
};

type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
};

export function Badge({ label, variant = 'default' }: BadgeProps) {
  const { bg, text } = VARIANT[variant];
  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  label: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.label,
    fontWeight: typography.weights.semibold,
  },
});
