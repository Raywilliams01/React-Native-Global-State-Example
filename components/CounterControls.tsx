import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RenderFlash } from './RenderFlash';
import { LogEntry } from '@/types';
import { formatTimestamp } from '@/utils/format';

type Props = {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onRender: (entry: LogEntry) => void;
  tabColor: string;
};

export function CounterControls({
  count,
  onIncrement,
  onDecrement,
  onRender,
  tabColor,
}: Props) {
  useEffect(() => {
    onRender({
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      component: 'CounterControls',
      timestamp: formatTimestamp(),
    });
  });

  return (
    <RenderFlash tabColor={tabColor} label="CounterControls">
      <Text style={styles.fieldLabel}>Count</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: tabColor }]}
          onPress={onDecrement}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.countText}>{count}</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: tabColor }]}
          onPress={onIncrement}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </RenderFlash>
  );
}

const styles = StyleSheet.create({
  fieldLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '600',
    lineHeight: 30,
  },
  countText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#111827',
    minWidth: 64,
    textAlign: 'center',
  },
});
