import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { Avatar } from '../../src/components/Avatar';
import { useAppStore } from '../../src/store/useAppStore';
import { colors, typography, spacing, radius, shadows } from '../../src/theme/tokens';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const updateProfile = useAppStore((s) => s.updateProfile);

  const [cidade, setCidade] = useState(user?.cidade ?? '');
  const [instituicao, setInstituicao] = useState(user?.instituicao ?? '');

  function handleContinue() {
    updateProfile({ cidade, instituicao });
    router.push('/(profile)/preferences');
  }

  function handleSkip() {
    updateProfile({ cidade, instituicao });
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Personalize seu perfil</Text>
          <Text style={styles.subtitle}>
            Essas informações ajudam outros universitários a te encontrar.
          </Text>
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Avatar uri={user?.foto} size="lg" name={user?.nome} />
            <TouchableOpacity style={styles.editBadge}>
              <Feather name="camera" size={14} color={colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.apelido ?? user?.nome}</Text>
        </View>

        {/* Campos */}
        <View style={styles.fields}>
          <Input
            label="Cidade"
            placeholder="Ex: São Paulo"
            value={cidade}
            onChangeText={setCidade}
            autoCapitalize="words"
          />
          <Input
            label="Instituição de ensino"
            placeholder="Ex: USP, FATEC, Mackenzie"
            value={instituicao}
            onChangeText={setInstituicao}
            autoCapitalize="words"
          />
        </View>

        {/* Pergunta */}
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>Deseja completar seu perfil agora?</Text>
          <Text style={styles.questionSub}>Adicione preferências e uma curiosidade sobre você.</Text>
          <View style={styles.questionButtons}>
            <Button title="Sim, continuar" onPress={handleContinue} style={styles.flexBtn} />
            <Button title="Pular" variant="outline" onPress={handleSkip} style={styles.flexBtn} />
          </View>
        </View>
      </View>
    </SafeAreaView>
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
    gap: spacing.xl,
  },
  header: {
    gap: spacing.xs,
  },
  title: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.extrabold,
    color: colors.ink,
  },
  subtitle: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.inkMuted,
    lineHeight: typography.sizes.body * typography.lineHeights.normal,
  },
  avatarSection: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatarWrapper: {
    position: 'relative',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.card,
  },
  userName: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h1,
    fontWeight: typography.weights.bold,
    color: colors.ink,
  },
  fields: {
    gap: spacing.md,
  },
  questionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  questionText: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h2,
    fontWeight: typography.weights.bold,
    color: colors.ink,
  },
  questionSub: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.inkMuted,
    marginTop: -spacing.xs,
  },
  questionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  flexBtn: {
    flex: 1,
  },
});
