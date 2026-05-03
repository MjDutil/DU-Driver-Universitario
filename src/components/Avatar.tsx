import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, typography } from '../theme/tokens';

type AvatarSize = 'sm' | 'md' | 'lg';

const SIZE_MAP: Record<AvatarSize, number> = { sm: 32, md: 48, lg: 64 };
const FONT_MAP: Record<AvatarSize, number> = { sm: 11, md: 16, lg: 22 };

type AvatarProps = {
  uri?: string | null;
  size?: AvatarSize;
  name?: string;
};

function initials(name: string) {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ uri, size = 'md', name }: AvatarProps) {
  const dim = SIZE_MAP[size];
  const circle = { width: dim, height: dim, borderRadius: dim / 2 };

  if (uri) {
    return <Image source={{ uri }} style={[styles.image, circle]} />;
  }

  return (
    <View style={[styles.fallback, circle]}>
      <Text style={[styles.initials, { fontSize: FONT_MAP[size] }]}>
        {name ? initials(name) : '?'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.border,
  },
  fallback: {
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: typography.fonts.heading,
    fontWeight: typography.weights.bold,
    color: colors.primaryDark,
  },
});
