import { Stack } from 'expo-router';
import { colors } from '../../src/theme/tokens';

export default function OfferLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.card },
        animation: 'slide_from_right',
      }}
    />
  );
}
