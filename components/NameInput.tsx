import React, { useEffect } from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';
import { RenderFlash } from './RenderFlash';
import { LogEntry } from '@/types';
import { formatTimestamp } from '@/utils/format';

type Props = {
  value: string;
  onChange: (name: string) => void;
  onRender: (entry: LogEntry) => void;
  tabColor: string;
};

export function NameInput({ value, onChange, onRender, tabColor }: Props) {
  useEffect(() => {
    onRender({
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      component: 'NameInput',
      timestamp: formatTimestamp(),
    });
  });

  return (
    <RenderFlash tabColor={tabColor} label="NameInput">
      <Text style={styles.fieldLabel}>Name</Text>
      <TextInput
        style={[styles.input, { borderColor: tabColor }]}
        value={value}
        onChangeText={onChange}
        placeholder="Enter name"
        placeholderTextColor="#9CA3AF"
      />
    </RenderFlash>
  );
}

const styles = StyleSheet.create({
  fieldLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
});
