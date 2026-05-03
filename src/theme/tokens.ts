import { Platform } from 'react-native';

export const colors = {
  primary: '#FF0381',
  primaryDark: '#D6006C',
  primaryLight: '#FFD6ED',
  ink: '#1A1A2E',
  inkMuted: '#6B6B8A',
  inkSubtle: '#9A9AB0',
  surface: '#F5F5FC',
  card: '#FFFFFF',
  border: '#EAEAF5',
  success: '#1DB860',
  warning: '#FF9500',
  error: '#FF3B30',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export const typography = {
  fonts: {
    heading: 'PlusJakartaSans',
    body: 'DMSans',
  },
  sizes: {
    display: 28,
    h1: 20,
    h2: 16,
    body: 15,
    caption: 13,
    label: 11,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeights: {
    tight: 1.1,
    normal: 1.5,
    relaxed: 1.7,
  },
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  btnHeight: 48,
  tabBarHeight: 80,
} as const;

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const shadows = {
  card: {
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sheet: {
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;
