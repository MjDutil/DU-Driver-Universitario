import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme/tokens';

type StarRatingProps = {
  rating: number;
  size?: number;
  onRate?: (rating: number) => void;
};

export function StarRating({ rating, size = 14, onRate }: StarRatingProps) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(rating);
        const node = (
          <Text
            key={star}
            style={{ fontSize: size, color: filled ? colors.warning : colors.border, lineHeight: size + 4 }}
          >
            {filled ? '★' : '☆'}
          </Text>
        );
        if (onRate) {
          return (
            <TouchableOpacity
              key={star}
              onPress={() => onRate(star)}
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            >
              {node}
            </TouchableOpacity>
          );
        }
        return node;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.xxs,
  },
});
