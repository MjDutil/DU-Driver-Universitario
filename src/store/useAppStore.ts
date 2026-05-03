import { create } from 'zustand';
import { MockUser } from '../mocks/data';

type AppState = {
  user: MockUser | null;
  isAuthenticated: boolean;
};

type AppActions = {
  setUser: (user: MockUser) => void;
  updateProfile: (partial: Partial<Pick<MockUser, 'cidade' | 'instituicao' | 'foto' | 'preferencias' | 'curiosidade' | 'musica' | 'tratamento'>>) => void;
  logout: () => void;
};

export const useAppStore = create<AppState & AppActions>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: true }),
  updateProfile: (partial) =>
    set((s) => ({ user: s.user ? { ...s.user, ...partial } : s.user })),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
