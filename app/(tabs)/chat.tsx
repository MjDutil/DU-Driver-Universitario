import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ListRenderItemInfo } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { mockConversas, MockConversa } from '../../src/mocks/data';
import { Avatar } from '../../src/components/Avatar';
import { colors, typography, spacing, radius } from '../../src/theme/tokens';

export default function ChatScreen() {
  const router = useRouter();

  function renderItem({ item }: ListRenderItemInfo<MockConversa>) {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/chat/${item.id}`)}
        activeOpacity={0.7}
      >
        <Avatar uri={item.foto} size="md" name={item.nome} />
        <View style={styles.info}>
          <View style={styles.topRow}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.horario}>{item.horario}</Text>
          </View>
          <Text style={styles.ultima} numberOfLines={1}>{item.ultimaMensagem}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Mensagens</Text>
      </View>

      {mockConversas.length > 0 ? (
        <FlatList
          data={mockConversas}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.empty}>
          <Feather name="message-circle" size={48} color={colors.border} />
          <Text style={styles.emptyTitle}>Nenhuma conversa ainda</Text>
          <Text style={styles.emptySub}>Solicite uma carona para começar a conversar.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h1,
    fontWeight: typography.weights.bold,
    color: colors.ink,
  },
  list: { paddingVertical: spacing.xs },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
  },
  info: { flex: 1, gap: spacing.xxs },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nome: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
    color: colors.ink,
  },
  horario: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.label,
    color: colors.inkSubtle,
  },
  ultima: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.inkMuted,
  },
  separator: { height: 1, backgroundColor: colors.border, marginLeft: spacing.md + 48 + spacing.md },
  empty: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, paddingHorizontal: spacing.xxl,
  },
  emptyTitle: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h2,
    fontWeight: typography.weights.bold,
    color: colors.ink,
  },
  emptySub: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.inkMuted,
    textAlign: 'center',
  },
});
