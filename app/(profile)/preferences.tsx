import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthLayout } from '../../src/components/AuthLayout';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { useAppStore } from '../../src/store/useAppStore';
import { colors, typography, spacing, radius } from '../../src/theme/tokens';

const OPCOES = [
  '🎵 Música', '🎮 Games', '📚 Leitura', '🎬 Cinema',
  '🏃 Esportes', '🍕 Gastronomia', '✈️ Viagens', '🎨 Arte',
  '💻 Tecnologia', '🌱 Sustentabilidade', '🐾 Animais', '📷 Fotografia',
  '🧘 Bem-estar', '🎭 Teatro', '🎲 Board games', '🌍 Idiomas',
];

export default function PreferencesScreen() {
  const router = useRouter();
  const updateProfile = useAppStore((s) => s.updateProfile);

  const [selecionadas, setSelecionadas] = useState<string[]>([]);
  const [curiosidade, setCuriosidade] = useState('');
  const [musica, setMusica] = useState('');

  function toggle(item: string) {
    setSelecionadas((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  }

  function handleFinish() {
    updateProfile({ preferencias: selecionadas, curiosidade, musica });
    router.replace('/(profile)/done');
  }

  return (
    <AuthLayout
      title="Suas preferências"
      subtitle="Conte um pouco sobre você para conectar com universitários parecidos."
      step={2}
      totalSteps={2}
    >
      {/* Chips */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Do que você gosta?</Text>
        <View style={styles.chipsWrap}>
          {OPCOES.map((item) => {
            const ativo = selecionadas.includes(item);
            return (
              <TouchableOpacity
                key={item}
                style={[styles.chip, ativo && styles.chipActive]}
                onPress={() => toggle(item)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, ativo && styles.chipTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Curiosidade */}
      <View style={styles.section}>
        <Input
          label="Uma curiosidade sobre você"
          placeholder="Ex: Já morei em 4 cidades diferentes..."
          value={curiosidade}
          onChangeText={setCuriosidade}
          autoCapitalize="sentences"
        />
      </View>

      {/* Música */}
      <View style={styles.section}>
        <Input
          label="Música ou artista favorito"
          placeholder="Ex: The Beatles, Djavan, Billie Eilish..."
          value={musica}
          onChangeText={setMusica}
          autoCapitalize="words"
        />
      </View>

      <Button title="Finalizar" onPress={handleFinish} />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.xs,
  },
  sectionLabel: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.medium,
    color: colors.inkMuted,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  chipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  chipText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.inkMuted,
  },
  chipTextActive: {
    color: colors.primaryDark,
    fontWeight: typography.weights.semibold,
  },
});
