import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, Modal, Animated, Pressable, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppStore } from '../../src/store/useAppStore';
import { mockMotoristas, MockMotorista } from '../../src/mocks/data';
import { DriverCard } from '../../src/components/DriverCard';
import { Avatar } from '../../src/components/Avatar';
import { StarRating } from '../../src/components/StarRating';
import { Badge } from '../../src/components/Badge';
import { Button } from '../../src/components/Button';
import { colors, typography, spacing, radius, shadows } from '../../src/theme/tokens';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

export default function BuscarScreen() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const [query, setQuery] = useState('');
  const [apenasMultheres, setApenasMultheres] = useState(false);
  const [selected, setSelected] = useState<MockMotorista | null>(null);
  const slideAnim = useRef(new Animated.Value(400)).current;

  const filtered = mockMotoristas.filter((d) => {
    const matchQuery =
      d.nome.toLowerCase().includes(query.toLowerCase()) ||
      d.destino.toLowerCase().includes(query.toLowerCase());
    const matchGenero = !apenasMultheres || d.tratamento === 'Sra';
    return matchQuery && matchGenero;
  });

  function openSheet(driver: MockMotorista) {
    setSelected(driver);
    Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 80, friction: 12 }).start();
  }

  function closeSheet() {
    Animated.timing(slideAnim, { toValue: 400, duration: 250, useNativeDriver: true }).start(() =>
      setSelected(null)
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>{greeting()},</Text>
            <Text style={styles.name}>{user?.apelido ?? user?.nome ?? 'Universitário'} 👋</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.offerBtn} onPress={() => router.push('/offer/driver-data')}>
              <Feather name="plus" size={16} color={colors.white} />
              <Text style={styles.offerBtnText}>Oferecer</Text>
            </TouchableOpacity>
            <Avatar uri={user?.foto} size="md" name={user?.nome} />
          </View>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color={colors.inkSubtle} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar destino ou motorista..."
            placeholderTextColor={colors.inkSubtle}
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Feather name="x" size={16} color={colors.inkSubtle} />
            </TouchableOpacity>
          )}
        </View>

        {/* Sugeridos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sugeridos para você</Text>
          <Text style={styles.sectionSub}>
            Motoristas que vão para a {user?.instituicao ?? 'sua instituição'}
          </Text>
        </View>

        {/* Filtro apenas mulheres — visível só para Sra */}
        {user?.tratamento === 'Sra' && (
          <TouchableOpacity
            style={[styles.filterToggle, apenasMultheres && styles.filterToggleActive]}
            onPress={() => setApenasMultheres((v) => !v)}
            activeOpacity={0.7}
          >
            <Feather
              name="shield"
              size={14}
              color={apenasMultheres ? colors.white : colors.primary}
            />
            <Text style={[styles.filterToggleText, apenasMultheres && styles.filterToggleTextActive]}>
              Apenas motoristas mulheres
            </Text>
            {apenasMultheres && <Feather name="check" size={14} color={colors.white} />}
          </TouchableOpacity>
        )}

        <View style={styles.list}>
          {filtered.length > 0 ? (
            filtered.map((driver) => (
              <DriverCard key={driver.id} driver={driver} onPress={openSheet} />
            ))
          ) : (
            <View style={styles.empty}>
              <Feather name="search" size={32} color={colors.border} />
              <Text style={styles.emptyText}>Nenhum motorista encontrado</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom sheet */}
      <Modal visible={!!selected} transparent animationType="fade" onRequestClose={closeSheet}>
        <Pressable style={styles.overlay} onPress={closeSheet} />
        <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
          {selected && (
            <DriverSheet
              driver={selected}
              onClose={closeSheet}
              onRequest={() => { closeSheet(); router.push('/ride/tracking'); }}
            />
          )}
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
}

function DriverSheet({ driver, onClose, onRequest }: { driver: MockMotorista; onClose: () => void; onRequest: () => void }) {
  return (
    <View style={sheet.container}>
      <View style={sheet.handle} />

      <View style={sheet.profile}>
        <Avatar uri={driver.foto} size="lg" name={driver.nome} />
        <View style={sheet.profileInfo}>
          <Text style={sheet.name}>{driver.nome}</Text>
          <View style={sheet.ratingRow}>
            <StarRating rating={driver.avaliacao} size={14} />
            <Text style={sheet.ratingText}>{driver.avaliacao.toFixed(1)}</Text>
          </View>
          <Badge label="Motorista verificado" variant="success" />
        </View>
      </View>

      <View style={sheet.divider} />

      <View style={sheet.infoRow}>
        <InfoItem icon="map-pin" label="Destino" value={driver.destino} />
        <InfoItem icon="dollar-sign" label="Valor por vaga" value={`R$ ${driver.valor.toFixed(2).replace('.', ',')}`} />
      </View>

      <View style={sheet.infoRow}>
        <InfoItem icon="clock" label="Saída estimada" value="07:45" />
        <InfoItem icon="users" label="Vagas disponíveis" value="2 de 3" />
      </View>

      <Button title="Solicitar Carona" onPress={onRequest} />
      <Button title="Cancelar" variant="ghost" onPress={onClose} />
    </View>
  );
}

function InfoItem({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={info.container}>
      <View style={info.iconWrap}>
        <Feather name={icon} size={14} color={colors.primary} />
      </View>
      <View>
        <Text style={info.label}>{label}</Text>
        <Text style={info.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  container: { padding: spacing.md, gap: spacing.lg, paddingBottom: spacing.xxl },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.card,
  },
  filterToggleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterToggleText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.medium,
    color: colors.primary,
  },
  filterToggleTextActive: { color: colors.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerText: { gap: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  offerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  offerBtnText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.semibold,
    color: colors.white,
  },
  greeting: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.inkMuted,
  },
  name: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h1,
    fontWeight: typography.weights.bold,
    color: colors.ink,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    height: spacing.btnHeight,
    gap: spacing.xs,
    ...shadows.card,
  },
  searchInput: {
    flex: 1,
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.ink,
  },
  section: { gap: spacing.xxs },
  sectionTitle: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h2,
    fontWeight: typography.weights.bold,
    color: colors.ink,
  },
  sectionSub: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.inkSubtle,
  },
  list: { gap: spacing.sm },
  empty: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xxl },
  emptyText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.inkSubtle,
  },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(26,26,46,0.4)' },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    ...shadows.sheet,
  },
});

const sheet = StyleSheet.create({
  container: { padding: spacing.xl, gap: spacing.md },
  handle: {
    width: 40, height: 4, borderRadius: radius.pill,
    backgroundColor: colors.border, alignSelf: 'center', marginBottom: spacing.xs,
  },
  profile: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  profileInfo: { flex: 1, gap: spacing.xs },
  name: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h1,
    fontWeight: typography.weights.bold,
    color: colors.ink,
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  ratingText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.inkMuted,
  },
  divider: { height: 1, backgroundColor: colors.border },
  infoRow: { flexDirection: 'row', gap: spacing.md },
});

const info = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconWrap: {
    width: 32, height: 32, borderRadius: radius.sm,
    backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center',
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
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
    color: colors.ink,
  },
});
