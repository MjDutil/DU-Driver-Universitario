import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Avatar } from '../../src/components/Avatar';
import { Button } from '../../src/components/Button';
import { mockMotoristas } from '../../src/mocks/data';
import { colors, typography, spacing, radius, shadows } from '../../src/theme/tokens';

const MOTORISTA = mockMotoristas[0];
const TOTAL_STEPS = 5;

// Pontos mockados da rota em % da tela (x, y)
const ROTA = [
  { x: 20, y: 70 },
  { x: 30, y: 55 },
  { x: 45, y: 42 },
  { x: 60, y: 35 },
  { x: 78, y: 25 },
];

export default function TrackingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const motoristaX = useRef(new Animated.Value(ROTA[0].x)).current;
  const motoristaY = useRef(new Animated.Value(ROTA[0].y)).current;

  // Move o marcador do motorista ao longo da rota
  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        const next = prev < TOTAL_STEPS - 1 ? prev + 1 : prev;
        Animated.parallel([
          Animated.timing(motoristaX, { toValue: ROTA[next].x, duration: 1000, useNativeDriver: false }),
          Animated.timing(motoristaY, { toValue: ROTA[next].y, duration: 1000, useNativeDriver: false }),
        ]).start();
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Pulso no marcador
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.35, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const chegou = step === TOTAL_STEPS - 1;
  const minutosRestantes = (TOTAL_STEPS - 1 - step) * 3;

  return (
    <View style={styles.container}>
      {/* Mapa simulado */}
      <View style={styles.mapArea}>
        {/* Grade de fundo estilo mapa */}
        {Array.from({ length: 8 }).map((_, i) => (
          <View key={`h${i}`} style={[styles.gridLine, styles.gridH, { top: `${(i + 1) * 11}%` as any }]} />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={`v${i}`} style={[styles.gridLine, styles.gridV, { left: `${(i + 1) * 14}%` as any }]} />
        ))}

        {/* Rota (linha pontilhada entre os pontos) */}
        {ROTA.slice(0, -1).map((p, i) => {
          const next = ROTA[i + 1];
          const dx = next.x - p.x;
          const dy = next.y - p.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          return (
            <View
              key={`seg${i}`}
              style={[
                styles.routeSegment,
                {
                  left: `${p.x}%` as any,
                  top: `${p.y}%` as any,
                  width: `${len}%` as any,
                  transform: [{ rotate: `${angle}deg` }],
                  opacity: i < step ? 0.3 : 1,
                },
              ]}
            />
          );
        })}

        {/* Destino */}
        <View style={[styles.destinoMarker, { left: `${ROTA[ROTA.length - 1].x - 2}%` as any, top: `${ROTA[ROTA.length - 1].y - 5}%` as any }]}>
          <Feather name="map-pin" size={22} color={colors.ink} />
        </View>

        {/* Origem */}
        <View style={[styles.origemMarker, { left: `${ROTA[0].x - 1.5}%` as any, top: `${ROTA[0].y + 1}%` as any }]}>
          <View style={styles.origemDot} />
        </View>

        {/* Motorista animado */}
        <Animated.View
          style={[
            styles.motoristaWrap,
            {
              left: motoristaX.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
              top: motoristaY.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
            },
          ]}
        >
          <Animated.View style={[styles.motoristaPulse, { transform: [{ scale: pulseAnim }] }]} />
          <View style={styles.motoristaMarker}>
            <Feather name="truck" size={14} color={colors.white} />
          </View>
        </Animated.View>

        {/* Label do destino */}
        <View style={styles.destinoLabel}>
          <Text style={styles.destinoLabelText}>{MOTORISTA.destino}</Text>
        </View>
      </View>

      {/* Botão voltar */}
      <SafeAreaView style={styles.topOverlay} pointerEvents="box-none">
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.ink} />
        </TouchableOpacity>
        <View style={styles.etaBadge}>
          <Feather name="navigation" size={13} color={colors.primary} />
          <Text style={styles.etaText}>
            {chegou ? 'Chegou!' : `~${minutosRestantes} min`}
          </Text>
        </View>
      </SafeAreaView>

      {/* Card inferior */}
      <View style={styles.card}>
        <View style={styles.cardHandle} />
        <View style={styles.driverRow}>
          <Avatar uri={MOTORISTA.foto} size="md" name={MOTORISTA.nome} />
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{MOTORISTA.nome}</Text>
            <View style={styles.statusRow}>
              <View style={[styles.dot, chegou ? styles.dotGreen : styles.dotPrimary]} />
              <Text style={styles.statusText}>
                {chegou ? 'Chegou ao destino!' : `A caminho · ${minutosRestantes} min`}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.chatBtn} onPress={() => router.push('/chat/c001')}>
            <Feather name="message-circle" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <InfoItem icon="map-pin" label="Destino" value={MOTORISTA.destino} />
          <InfoItem icon="dollar-sign" label="Valor" value={`R$ ${MOTORISTA.valor.toFixed(2).replace('.', ',')}`} />
        </View>

        {chegou && (
          <Button title="Finalizar carona" onPress={() => router.replace('/ride/finish')} />
        )}
      </View>
    </View>
  );
}

function InfoItem({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={info.container}>
      <View style={info.iconWrap}>
        <Feather name={icon} size={13} color={colors.primary} />
      </View>
      <View>
        <Text style={info.label}>{label}</Text>
        <Text style={info.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapArea: {
    flex: 1,
    backgroundColor: '#E8EEF4',
    position: 'relative',
    overflow: 'hidden',
  },
  gridLine: { position: 'absolute', backgroundColor: '#D0DAE4' },
  gridH: { left: 0, right: 0, height: 1 },
  gridV: { top: 0, bottom: 0, width: 1 },
  routeSegment: {
    position: 'absolute',
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
    transformOrigin: 'left center',
  },
  destinoMarker: { position: 'absolute' },
  origemMarker: { position: 'absolute' },
  origemDot: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2, borderColor: colors.white,
  },
  motoristaWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  motoristaPulse: {
    position: 'absolute',
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.primaryLight,
    opacity: 0.6,
  },
  motoristaMarker: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.white,
  },
  destinoLabel: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.md,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.pill,
    ...shadows.card,
  },
  destinoLabelText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.ink,
  },
  topOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center', justifyContent: 'center',
    ...shadows.card,
  },
  etaBadge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xxs,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    ...shadows.card,
  },
  etaText: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.ink,
  },
  card: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
    ...shadows.sheet,
  },
  cardHandle: {
    width: 40, height: 4, borderRadius: radius.pill,
    backgroundColor: colors.border, alignSelf: 'center', marginBottom: spacing.xs,
  },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  driverInfo: { flex: 1, gap: spacing.xxs },
  driverName: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    color: colors.ink,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotPrimary: { backgroundColor: colors.primary },
  dotGreen: { backgroundColor: colors.success },
  statusText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.inkMuted,
  },
  chatBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  infoRow: { flexDirection: 'row', gap: spacing.md },
});

const info = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconWrap: {
    width: 30, height: 30, borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  label: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.label,
    color: colors.inkSubtle,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  value: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.medium,
    color: colors.ink,
  },
});
