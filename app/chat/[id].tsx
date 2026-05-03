import React, { useState, useRef } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { mockConversas, mockMensagens } from '../../src/mocks/data';
import { Avatar } from '../../src/components/Avatar';
import { colors, typography, spacing, radius } from '../../src/theme/tokens';

type Mensagem = { id: string; texto: string; minha: boolean; horario: string };

export default function ChatIndividualScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const conversa = mockConversas.find((c) => c.id === id);
  const [mensagens, setMensagens] = useState<Mensagem[]>(
    mockMensagens.filter((m) => m.conversaId === id)
  );
  const [texto, setTexto] = useState('');
  const listRef = useRef<FlatList>(null);

  function enviar() {
    if (!texto.trim()) return;
    const nova: Mensagem = {
      id: `msg_${Date.now()}`,
      texto: texto.trim(),
      minha: true,
      horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
    setMensagens((prev) => [...prev, nova]);
    setTexto('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }

  function renderItem({ item }: ListRenderItemInfo<Mensagem>) {
    return (
      <View style={[styles.bubble, item.minha ? styles.bubbleMinha : styles.bubbleDela]}>
        <Text style={[styles.bubbleText, item.minha ? styles.bubbleTextMinha : styles.bubbleTextDela]}>
          {item.texto}
        </Text>
        <Text style={[styles.bubbleHorario, item.minha ? styles.horarioMinha : styles.horarioDela]}>
          {item.horario}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="arrow-left" size={22} color={colors.ink} />
        </TouchableOpacity>
        <Avatar uri={conversa?.foto} size="sm" name={conversa?.nome} />
        <Text style={styles.headerName}>{conversa?.nome ?? 'Conversa'}</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={listRef}
          data={mensagens}
          keyExtractor={(m) => m.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Digite uma mensagem..."
            placeholderTextColor={colors.inkSubtle}
            value={texto}
            onChangeText={setTexto}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !texto.trim() && styles.sendBtnDisabled]}
            onPress={enviar}
            disabled={!texto.trim()}
          >
            <Feather name="send" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerName: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
    color: colors.ink,
    flex: 1,
  },
  list: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: radius.lg,
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.xxs,
  },
  bubbleMinha: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: radius.xs,
  },
  bubbleDela: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    borderBottomLeftRadius: radius.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bubbleText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    lineHeight: typography.sizes.body * typography.lineHeights.normal,
  },
  bubbleTextMinha: { color: colors.white },
  bubbleTextDela: { color: colors.ink },
  bubbleHorario: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.label,
    alignSelf: 'flex-end',
  },
  horarioMinha: { color: 'rgba(255,255,255,0.7)' },
  horarioDela: { color: colors.inkSubtle },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    minHeight: spacing.btnHeight,
    maxHeight: 120,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.ink,
  },
  sendBtn: {
    width: spacing.btnHeight,
    height: spacing.btnHeight,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.4 },
});
