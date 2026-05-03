import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppStore } from '../../src/store/useAppStore';
import { Avatar } from '../../src/components/Avatar';
import { Badge } from '../../src/components/Badge';
import { colors, typography, spacing, radius, shadows } from '../../src/theme/tokens';

type MenuItem = {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  onPress: () => void;
  destructive?: boolean;
};

function MenuRow({ item }: { item: MenuItem }) {
  return (
    <TouchableOpacity style={styles.menuRow} onPress={item.onPress} activeOpacity={0.7}>
      <View style={[styles.menuIcon, item.destructive && styles.menuIconDestructive]}>
        <Feather name={item.icon} size={18} color={item.destructive ? colors.error : colors.primary} />
      </View>
      <Text style={[styles.menuLabel, item.destructive && styles.menuLabelDestructive]}>
        {item.label}
      </Text>
      {!item.destructive && <Feather name="chevron-right" size={18} color={colors.inkSubtle} />}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const logout = useAppStore((s) => s.logout);

  function handleLogout() {
    Alert.alert('Sair', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(auth)/invite');
        },
      },
    ]);
  }

  const menuItems: MenuItem[] = [
    { icon: 'edit-2',    label: 'Editar perfil',       onPress: () => router.push('/(profile)/setup') },
    { icon: 'heart',     label: 'Editar preferências', onPress: () => router.push('/(profile)/preferences') },
    { icon: 'file-text', label: 'Termos de uso',       onPress: () => {} },
    { icon: 'log-out',   label: 'Sair',                onPress: handleLogout, destructive: true },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Avatar uri={user?.foto} size="lg" name={user?.nome} />
          <Text style={styles.name}>{user?.nome ?? 'Usuário'}</Text>
          {user?.apelido && user.apelido !== user.nome && (
            <Text style={styles.apelido}>@{user.apelido}</Text>
          )}
          <View style={styles.badgeRow}>
            {user?.instituicao ? <Badge label={user.instituicao} variant="default" /> : null}
            {user?.cidade ? <Badge label={user.cidade} variant="default" /> : null}
          </View>
          {/* Nível */}
          <View style={styles.levelBadge}>
            <Text style={styles.levelIcon}>🥉</Text>
            <Text style={styles.levelText}>Bronze</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatItem value="12" label="Caronas" />
          <View style={styles.statDivider} />
          <StatItem value="4.9" label="Avaliação" />
          {/* <View style={styles.statDivider} />
          <StatItem value="3" label="Amigos" /> */}
        </View>

        {/* Preferências */}
        {(user?.preferencias?.length || user?.curiosidade || user?.musica) ? (
          <View style={styles.prefsCard}>
            <Text style={styles.prefsTitle}>Preferências</Text>
            {user?.preferencias && user.preferencias.length > 0 && (
              <View style={styles.chipsWrap}>
                {user.preferencias.map((p) => (
                  <View key={p} style={styles.chip}>
                    <Text style={styles.chipText}>{p}</Text>
                  </View>
                ))}
              </View>
            )}
            {user?.curiosidade ? (
              <PrefRow icon="smile" label="Curiosidade" value={user.curiosidade} />
            ) : null}
            {user?.musica ? (
              <PrefRow icon="music" label="Música favorita" value={user.musica} />
            ) : null}
          </View>
        ) : null}

        {/* Menu */}
        <View style={styles.menuCard}>
          {menuItems.map((item, i) => (
            <View key={item.label}>
              <MenuRow item={item} />
              {i < menuItems.length - 1 && <View style={styles.menuSeparator} />}
            </View>
          ))}
        </View>

        <Text style={styles.version}>DU App · v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function PrefRow({ icon, label, value }: { icon: React.ComponentProps<typeof Feather>['name']; label: string; value: string }) {
  return (
    <View style={styles.prefRow}>
      <Feather name={icon} size={14} color={colors.primary} />
      <Text style={styles.prefLabel}>{label}:</Text>
      <Text style={styles.prefValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  container: { padding: spacing.md, gap: spacing.lg, paddingBottom: spacing.xxl },
  hero: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  name: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h1,
    fontWeight: typography.weights.extrabold,
    color: colors.ink,
  },
  apelido: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.inkMuted,
    marginTop: -spacing.xxs,
  },
  badgeRow: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap', justifyContent: 'center' },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.card,
  },
  stat: { flex: 1, alignItems: 'center', gap: spacing.xxs },
  statValue: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h1,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
  },
  statLabel: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.inkMuted,
  },
  statDivider: { width: 1, backgroundColor: colors.border },
  menuCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.card,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  menuIcon: {
    width: 36, height: 36, borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  menuIconDestructive: { backgroundColor: '#FFE5E4' },
  menuLabel: {
    flex: 1,
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.ink,
  },
  menuLabelDestructive: { color: colors.error },
  menuSeparator: { height: 1, backgroundColor: colors.border, marginLeft: spacing.md + 36 + spacing.md },
  version: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.label,
    color: colors.inkSubtle,
    textAlign: 'center',
  },
  prefsCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.card,
  },
  prefsTitle: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.semibold,
    color: colors.inkMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  chipText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.primaryDark,
  },
  prefRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs },
  prefLabel: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.inkSubtle,
    minWidth: 90,
  },
  prefValue: {
    flex: 1,
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.ink,
    fontWeight: typography.weights.medium,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    backgroundColor: '#FFF3E0',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  levelIcon: { fontSize: 14 },
  levelText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.semibold,
    color: '#E65100',
  },
});
