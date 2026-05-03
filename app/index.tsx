import { Redirect } from 'expo-router';
import { useAppStore } from '../src/store/useAppStore';

export default function RootIndex() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  return <Redirect href={isAuthenticated ? '/(tabs)' : '/(auth)/invite'} />;
}
