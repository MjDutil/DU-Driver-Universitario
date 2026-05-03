import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, PanResponder,
  TouchableOpacity, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Avatar } from '../../src/components/Avatar';
import { StarRating } from '../../src/components/StarRating';
import { Button } from '../../src/components/Button';
import { mockMotoristas } from '../../src/mocks/data';
import { colors, typography, spacing, radius, shadows } from '../../src/theme/tokens';

const MOTORISTA = mockMotoristas[0];
const SWIPE_WIDTH = 280;
const THUMB_SIZE = 52;

export default function FinishScreen() {
  const router = useRouter();
  const [encerrado, setEncerrado] = useState(false);
  const [avaliacao, setAvaliacao] = useState(0);
  const [comentario, setComentario] = useState('');
  const [enviado, setEnviado] = useState(false);

  // Swipe para encerrar
  const swipeX = useRef(new Animated.Value(0)).current;
  const maxSwipe = SWIPE_WIDTH - THUMB_SIZE - spacing.xs * 2;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => {
        const x = Math.max(0, Math.min(g.dx, maxSwipe));
        swipeX.setValue(x);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx >= maxSwipe * 0.85) {
          Animated.timing(swipeX, { toValue: maxSwipe, duration: 150, useNativeDriver: false }).start(() =>
            setEncerrado(true)
          );
        } else {
          Animated.spring(swipeX, { toValue: 0, useNativeDriver: false }).start();
        }
      },
    })
  ).current;

  const thumbBg = swipeX.interpolate({
    inputRange: [0, maxSwipe],
    outputRange: [colors.primary, colors.success],
  });

  function handleAvaliar() {
    setEnviado(true);
    setTimeout(() => router.replace('/(tabs)'), 1500);
  }

  if (enviado) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Feather name="check" size={40} color={colors.white} />
          </View>
          <Text style={styles.successTitle}>Obrigado pela avaliação!</Text>
          <Text style={styles.successSub}>Até a próxima carona 🚗</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (encerrado) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Avalie sua carona</Text>
            <Text style={styles.subtitle}>Como foi a experiência com {MOTORISTA.nome}?</Text>
          </View>

          <View style={styles.driverCard}>
            <Avatar uri={MOTORISTA.foto} size="lg" name={MOTORISTA.nome} />
            <Text style={styles.driverName}>{MOTORISTA.nome}</Text>
            <StarRating rating={avaliacao} size={32} onRate={setAvaliacao} />
            <Text style={styles.ratingHint}>
              {avaliacao === 0 ? 'Toque para avaliar' :
               avaliacao <= 2 ? 'Que pena...' :
               avaliacao === 3 ? 'Foi ok' :
               avaliacao === 4 ? 'Boa carona!' : 'Excelente! ⭐'}
            </Text>
          </View>

          <TextInput
            style={styles.comentario}
            placeholder="Deixe um comentário (opcional)..."
            placeholderTextColor={colors.inkSubtle}
            value={comentario}
            onChangeText={setComentario}
            multiline
            maxLength={200}
          />

          <Button
            title="Enviar avaliação"
            onPress={handleAvaliar}
            disabled={avaliacao === 0}
          />
          <Button title="Pular" variant="ghost" onPress={() => router.replace('/(tabs)')} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={22} color={colors.ink} />
          </TouchableOpacity>
          <Text style={styles.title}>Finalizar carona</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Avatar uri={MOTORISTA.foto} size="md" name={MOTORISTA.nome} />
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryDriver}>{MOTORISTA.nome}</Text>
              <Text style={styles.summaryDestino}>{MOTORISTA.destino}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.payRow}>
            <Text style={styles.payLabel}>Valor da corrida</Text>
            <Text style={styles.payValue}>R$ {MOTORISTA.valor.toFixed(2).replace('.', ',')}</Text>
          </View>
          <View style={styles.payRow}>
            <Text style={styles.payLabel}>Forma de pagamento</Text>
            <View style={styles.payMethod}>
              <Feather name="credit-card" size={14} color={colors.inkMuted} />
              <Text style={styles.payMethodText}>Pix / Dinheiro</Text>
            </View>
          </View>
        </View>

        <View style={styles.swipeArea}>
          <Text style={styles.swipeLabel}>Arraste para encerrar</Text>
          <View style={[styles.swipeTrack, { width: SWIPE_WIDTH }]}>
            <Text style={styles.swipeTrackText}>Encerrar carona →</Text>
            <Animated.View
              style={[styles.swipeThumb, { left: swipeX, backgroundColor: thumbBg }]}
              {...panResponder.panHandlers}
            >
              <Feather name="chevrons-right" size={22} color={colors.white} />
            </Animated.View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.card },
  container: { flex: 1, padding: spacing.xl, gap: spacing.xl },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  title: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h1,
    fontWeight: typography.weights.extrabold,
    color: colors.ink,
    flex: 1,
  },
  subtitle: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.inkMuted,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  summaryInfo: { flex: 1, gap: spacing.xxs },
  summaryDriver: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    color: colors.ink,
  },
  summaryDestino: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.inkSubtle,
  },
  divider: { height: 1, backgroundColor: colors.border },
  payRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  payLabel: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.inkMuted,
  },
  payValue: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h2,
    fontWeight: typography.weights.bold,
    color: colors.ink,
  },
  payMethod: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
  payMethodText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.inkMuted,
  },
  swipeArea: { alignItems: 'center', gap: spacing.sm, marginTop: 'auto' },
  swipeLabel: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.inkSubtle,
  },
  swipeTrack: {
    height: THUMB_SIZE + spacing.xs * 2,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeTrackText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.inkSubtle,
  },
  swipeThumb: {
    position: 'absolute',
    left: spacing.xs,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverCard: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.lg },
  driverName: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h1,
    fontWeight: typography.weights.bold,
    color: colors.ink,
  },
  ratingHint: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.inkMuted,
  },
  comentario: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.md,
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.ink,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  successIcon: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: colors.success,
    alignItems: 'center', justifyContent: 'center',
  },
  successTitle: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.extrabold,
    color: colors.ink,
    textAlign: 'center',
  },
  successSub: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.inkMuted,
  },
});
