import React, { createContext, useContext, useState } from 'react';
import { AppState } from '@/types';

type ContextValue = {
  state: AppState;
  setName: (name: string) => void;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
};

const CounterContext = createContext<ContextValue | null>(null);

export function CounterProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({ name: 'Ada', count: 0 });

  const setName = (name: string) => setState((prev) => ({ ...prev, name }));
  const increment = () => setState((prev) => ({ ...prev, count: prev.count + 1 }));
  const decrement = () => setState((prev) => ({ ...prev, count: prev.count - 1 }));
  const reset = () => setState({ name: 'Ada', count: 0 });

  return (
    <CounterContext.Provider value={{ state, setName, increment, decrement, reset }}>
      {children}
    </CounterContext.Provider>
  );
}

export function useCounterContext() {
  const ctx = useContext(CounterContext);
  if (!ctx) throw new Error('useCounterContext must be used within a <CounterProvider>');
  return ctx;
}
