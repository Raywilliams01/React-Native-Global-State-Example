import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { RenderFlash } from './RenderFlash';
import { LogEntry } from '@/types';
import { formatTimestamp } from '@/utils/format';

type Props = {
  onRender: (entry: LogEntry) => void;
  tabColor: string;
};

// CRITICAL: zero connection to any state store.
// Re-renders only when its parent re-renders — which is always in Context,
// but never on isolated state changes in Redux / Zustand.
export function Logger({ onRender, tabColor }: Props) {
  useEffect(() => {
    onRender({
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      component: 'Logger',
      timestamp: formatTimestamp(),
    });
  });

  return (
    <RenderFlash tabColor={tabColor} label="Logger">
      <Text style={styles.title}>Logger — not subscribed to state</Text>
      <Text style={styles.subtitle}>I re-render when my parent re-renders</Text>
    </RenderFlash>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  subtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
});
