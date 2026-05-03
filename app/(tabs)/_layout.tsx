import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../src/theme/tokens';

type FeatherName = React.ComponentProps<typeof Feather>['name'];

function icon(name: FeatherName) {
  return ({ color }: { color: string }) => <Feather name={name} size={22} color={color} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inkSubtle,
        tabBarStyle: {
          height: spacing.tabBarHeight,
          paddingBottom: spacing.md,
          paddingTop: spacing.xs,
          borderTopColor: colors.border,
          backgroundColor: colors.card,
        },
        tabBarLabelStyle: {
          fontFamily: typography.fonts.body,
          fontSize: typography.sizes.label,
        },
      }}
    >
      <Tabs.Screen name="index"   options={{ title: 'Buscar',    tabBarIcon: icon('search') }} />
      <Tabs.Screen name="chat"    options={{ title: 'Chat',      tabBarIcon: icon('message-circle') }} />
      <Tabs.Screen name="history" options={{ title: 'Histórico', tabBarIcon: icon('clock') }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil',    tabBarIcon: icon('user') }} />
    </Tabs>
  );
}
