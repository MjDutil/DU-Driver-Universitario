import { create } from 'zustand';

type OfferDraft = {
  cnh: string;
  marca: string;
  modelo: string;
  cor: string;
  origem: string;
  destino: string;
  datas: string[];
  passageiros: number;
  valor: string;
};

type OfferStore = {
  draft: OfferDraft;
  setDraft: (partial: Partial<OfferDraft>) => void;
  resetDraft: () => void;
};

const initial: OfferDraft = {
  cnh: '', marca: '', modelo: '', cor: '',
  origem: '', destino: '', datas: [],
  passageiros: 1, valor: '',
};

export const useOfferStore = create<OfferStore>((set) => ({
  draft: initial,
  setDraft: (partial) => set((s) => ({ draft: { ...s.draft, ...partial } })),
  resetDraft: () => set({ draft: initial }),
}));
