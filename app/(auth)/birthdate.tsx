import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ListRenderItemInfo } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthLayout } from '../../src/components/AuthLayout';
import { Button } from '../../src/components/Button';
import { useAuthStore } from '../../src/store/useAuthStore';
import { colors, typography, spacing, radius } from '../../src/theme/tokens';

const MONTHS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];

const ITEM_HEIGHT = 44;
const COL_LABEL_HEIGHT = 40;
const VISIBLE_ITEMS = 5;

function formatDate(day: number, month: number, year: number) {
  return `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`;
}

type ColumnProps<T> = {
  data: T[];
  selected: T;
  onSelect: (item: T) => void;
  keyExtractor: (item: T) => string;
  renderLabel: (item: T) => string;
};

function Column<T>({ data, selected, onSelect, keyExtractor, renderLabel }: ColumnProps<T>) {
  const ref = useRef<FlatList>(null);
  const selectedIndex = data.indexOf(selected);

  useEffect(() => {
    if (selectedIndex >= 0) {
      ref.current?.scrollToIndex({ index: selectedIndex, animated: false, viewPosition: 0.5 });
    }
  }, []);

  function renderItem({ item }: ListRenderItemInfo<T>) {
    const active = item === selected;
    return (
      <TouchableOpacity
        style={[styles.item, active && styles.itemActive]}
        onPress={() => onSelect(item)}
        activeOpacity={0.7}
      >
        <Text style={[styles.itemText, active && styles.itemTextActive]}>
          {renderLabel(item)}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <FlatList
      ref={ref}
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
      style={styles.list}
      onScrollToIndexFailed={() => {}}
    />
  );
}

export default function BirthdateScreen() {
  const router = useRouter();
  const setDraft = useAuthStore((s) => s.setDraft);
  const stored = useAuthStore((s) => s.draft.dataNascimento);

  const initial = stored ? new Date(stored) : new Date(2000, 0, 1);
  const [day, setDay] = useState(initial.getDate());
  const [month, setMonth] = useState(initial.getMonth());
  const [year, setYear] = useState(initial.getFullYear());
  const [error, setError] = useState('');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 80 }, (_, i) => currentYear - 16 - i);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const clampedDay = Math.min(day, daysInMonth);

  function handleContinue() {
    const date = new Date(year, month, clampedDay);
    const age = currentYear - date.getFullYear();
    if (age < 16) {
      setError('Você precisa ter pelo menos 16 anos');
      return;
    }
    setError('');
    setDraft({ dataNascimento: date.toISOString() });
    router.push('/(auth)/password');
  }

  return (
    <AuthLayout title="Data de nascimento" step={6} totalSteps={7}>
      <View style={styles.pickerContainer}>
        <View style={styles.pickerRow}>
          {/* Dia */}
          <View style={styles.colWrapper}>
            <Text style={styles.colLabel}>Dia</Text>
            <Column
              data={days}
              selected={clampedDay}
              onSelect={setDay}
              keyExtractor={(d) => String(d)}
              renderLabel={(d) => String(d).padStart(2, '0')}
            />
          </View>

          {/* Mês */}
          <View style={[styles.colWrapper, styles.colWide]}>
            <Text style={styles.colLabel}>Mês</Text>
            <Column
              data={Array.from({ length: 12 }, (_, i) => i)}
              selected={month}
              onSelect={setMonth}
              keyExtractor={(m) => String(m)}
              renderLabel={(m) => MONTHS[m]}
            />
          </View>

          {/* Ano */}
          <View style={[styles.colWrapper, styles.colLast]}>
            <Text style={styles.colLabel}>Ano</Text>
            <Column
              data={years}
              selected={year}
              onSelect={setYear}
              keyExtractor={(y) => String(y)}
              renderLabel={(y) => String(y)}
            />
          </View>
        </View>
      </View>

      <Text style={styles.preview}>{formatDate(clampedDay, month, year)}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Continuar" onPress={handleContinue} />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS + COL_LABEL_HEIGHT,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  pickerRow: {
    flex: 1,
    flexDirection: 'row',
  },
  colWrapper: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  colWide: {
    flex: 2,
  },
  colLast: {
    borderRightWidth: 0,
  },
  colLabel: {
    height: COL_LABEL_HEIGHT,
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.medium,
    color: colors.inkMuted,
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: COL_LABEL_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  list: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  itemActive: {
    backgroundColor: colors.primaryLight,
  },
  itemText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.inkMuted,
  },
  itemTextActive: {
    fontFamily: typography.fonts.heading,
    fontWeight: typography.weights.bold,
    color: colors.primaryDark,
  },
  preview: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h1,
    fontWeight: typography.weights.semibold,
    color: colors.ink,
    textAlign: 'center',
  },
  error: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.error,
    textAlign: 'center',
  },
});
