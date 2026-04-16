import { create } from 'zustand';

interface StoreState {
  name: string;
  count: number;
  setName: (name: string) => void;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useCounterStore = create<StoreState>()((set) => ({
  name: 'Ada',
  count: 0,
  setName: (name) => set({ name }),
  increment: () => set((s) => ({ count: s.count + 1 })),
  decrement: () => set((s) => ({ count: s.count - 1 })),
  reset: () => set({ name: 'Ada', count: 0 }),
}));
