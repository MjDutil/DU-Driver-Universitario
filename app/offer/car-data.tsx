import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { AuthLayout } from '../../src/components/AuthLayout';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { useOfferStore } from '../../src/store/useOfferStore';
import { colors, typography, spacing, radius, shadows } from '../../src/theme/tokens';

const COR_HEX: Record<string, string> = {
  'Branco': '#FFFFFF', 'Prata': '#C0C0C0', 'Preto': '#1A1A1A', 'Cinza': '#808080',
  'Vermelho': '#CC0000', 'Azul': '#1565C0', 'Azul Claro': '#42A5F5', 'Verde': '#2E7D32',
  'Amarelo': '#F9A825', 'Laranja': '#E65100', 'Marrom': '#5D4037', 'Bege': '#F5F0DC',
  'Dourado': '#CFB53B', 'Rosa': '#F06292', 'Vinho': '#880E4F',
};

const LIGHT_COLORS = ['Branco', 'Bege', 'Prata', 'Azul Claro', 'Amarelo'];

export default function CarDataScreen() {
  const router = useRouter();
  const { draft, setDraft } = useOfferStore();
  const [errors, setErrors] = useState({ marca: '', modelo: '', cor: '' });

  function handleContinue() {
    const e = { marca: '', modelo: '', cor: '' };
    if (!draft.marca.trim()) e.marca = 'Informe a marca';
    if (!draft.modelo.trim()) e.modelo = 'Informe o modelo';
    if (!draft.cor.trim()) e.cor = 'Selecione a cor';
    if (e.marca || e.modelo || e.cor) { setErrors(e); return; }
    router.push('/offer/route');
  }

  const corHex = draft.cor ? COR_HEX[draft.cor] : null;
  const isLight = draft.cor ? LIGHT_COLORS.includes(draft.cor) : false;

  return (
    <AuthLayout title="Dados do carro" step={2} totalSteps={6}>
      <Input
        label="Marca"
        placeholder="Ex: Fiat, Volkswagen, Chevrolet"
        value={draft.marca}
        onChangeText={(t) => { setDraft({ marca: t }); setErrors((e) => ({ ...e, marca: '' })); }}
        autoCapitalize="words"
        error={errors.marca}
      />
      <Input
        label="Modelo"
        placeholder="Ex: Argo, Polo, Onix"
        value={draft.modelo}
        onChangeText={(t) => { setDraft({ modelo: t }); setErrors((e) => ({ ...e, modelo: '' })); }}
        autoCapitalize="words"
        error={errors.modelo}
      />

      {/* Color select */}
      <View style={styles.fieldWrap}>
        <Text style={styles.fieldLabel}>Cor</Text>
        <TouchableOpacity
          style={[styles.selectBtn, errors.cor ? styles.selectBtnError : null]}
          onPress={() => { setErrors((e) => ({ ...e, cor: '' })); router.push('/offer/color-picker'); }}
          activeOpacity={0.7}
        >
          {corHex ? (
            <>
              <View style={[styles.dot, { backgroundColor: corHex }, isLight && styles.dotBorder]} />
              <Text style={styles.selectValue}>{draft.cor}</Text>
            </>
          ) : (
            <Text style={styles.selectPlaceholder}>Selecionar cor</Text>
          )}
          <Feather name="chevron-right" size={18} color={colors.inkSubtle} />
        </TouchableOpacity>
        {errors.cor ? <Text style={styles.errorText}>{errors.cor}</Text> : null}
      </View>

      <Button title="Continuar" onPress={handleContinue} />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  fieldWrap: { gap: spacing.xxs },
  fieldLabel: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.medium,
    color: colors.inkMuted,
  },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 52,
    ...shadows.card,
  },
  selectBtnError: { borderColor: colors.error },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  dotBorder: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectValue: {
    flex: 1,
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.ink,
  },
  selectPlaceholder: {
    flex: 1,
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.inkSubtle,
  },
  errorText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.error,
  },
});
