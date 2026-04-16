import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  children: React.ReactNode;
  tabColor: string;
  label?: string;
};

export function RenderFlash({ children, tabColor, label }: Props) {
  const borderWidth = useSharedValue(0);

  // No dependency array — fires on every render, animates the border pulse
  useEffect(() => {
    borderWidth.value = withSequence(
      withTiming(2, { duration: 80 }),
      withTiming(0, { duration: 320 })
    );
  });

  const animatedStyle = useAnimatedStyle(() => ({
    borderWidth: borderWidth.value,
    borderColor: tabColor,
    borderRadius: 12,
  }));

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
