import { create } from 'zustand';
import { Tratamento } from '../mocks/data';

type AuthDraft = {
  nome: string;
  apelido: string;
  dataNascimento: string;
  celular: string;
  email: string;
  senha: string;
  tratamento: Tratamento | '';
};

type AuthStore = {
  draft: AuthDraft;
  setDraft: (partial: Partial<AuthDraft>) => void;
  resetDraft: () => void;
};

const initialDraft: AuthDraft = {
  nome: '',
  apelido: '',
  dataNascimento: '',
  celular: '',
  email: '',
  senha: '',
  tratamento: '',
};

export const useAuthStore = create<AuthStore>((set) => ({
  draft: initialDraft,
  setDraft: (partial) => set((s) => ({ draft: { ...s.draft, ...partial } })),
  resetDraft: () => set({ draft: initialDraft }),
}));
