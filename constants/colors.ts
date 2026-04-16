export const TAB_COLORS = {
  redux: '#7C3AED',
  context: '#059669',
  zustand: '#DC2626',
} as const;

export type TabKey = keyof typeof TAB_COLORS;
