import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Button } from '../../src/components/Button';
import { useAppStore } from '../../src/store/useAppStore';
import { colors, typography, spacing, radius } from '../../src/theme/tokens';

export default function ProfileDoneScreen() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 6 }),
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.top}>
          <Animated.View style={[styles.iconCircle, { transform: [{ scale }] }]}>
            <Feather name="check" size={40} color={colors.white} />
          </Animated.View>

          <Animated.View style={[styles.textBlock, { opacity }]}>
            <Text style={styles.title}>Perfil completo!</Text>
            <Text style={styles.subtitle}>
              Tudo pronto, {user?.apelido ?? user?.nome}. Agora você pode buscar caronas
              e conectar com outros universitários.
            </Text>
          </Animated.View>

          {/* Resumo */}
          <Animated.View style={[styles.card, { opacity }]}>
            <Row icon="user" label="Nome" value={user?.nome ?? '—'} />
            {user?.cidade ? <Row icon="map-pin" label="Cidade" value={user.cidade} /> : null}
            {user?.instituicao ? <Row icon="book" label="Instituição" value={user.instituicao} /> : null}
          </Animated.View>
        </View>

        <Button title="Começar a usar o DU" onPress={() => router.replace('/(tabs)')} />
      </View>
    </SafeAreaView>
  );
}

function Row({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Feather name={icon} size={16} color={colors.primary} />
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.card,
  },
  container: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'space-between',
  },
  top: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  title: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.extrabold,
    color: colors.ink,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.inkMuted,
    textAlign: 'center',
    lineHeight: typography.sizes.body * typography.lineHeights.normal,
  },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rowText: {
    gap: 2,
  },
  rowLabel: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.label,
    color: colors.inkSubtle,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rowValue: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
    color: colors.ink,
  },
});
