import { useFocusEffect } from "expo-router";
import React, { useCallback, useRef } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TAB_COLORS } from "@/constants/colors";
import { useCounterStore } from "@/store/zustandStore";
import { LogEntry } from "@/types";

import { CounterControls } from "@/components/CounterControls";
import { Logger } from "@/components/Logger";
import { NameInput } from "@/components/NameInput";
import { RenderLog, RenderLogRef } from "@/components/RenderLog";
import { ResetButton } from "@/components/ResetButton";

const COLOR = TAB_COLORS.zustand;

// Each inner component subscribes only to the slice it needs, so a count
// change only re-renders CounterControlsZustand — not NameInputZustand or Logger.

function NameInputZustand({ onRender }: { onRender: (e: LogEntry) => void }) {
  const name = useCounterStore((s) => s.name);
  const setName = useCounterStore((s) => s.setName);
  return (
    <NameInput
      value={name}
      onChange={setName}
      onRender={onRender}
      tabColor={COLOR}
    />
  );
}

function CounterControlsZustand({
  onRender,
}: {
  onRender: (e: LogEntry) => void;
}) {
  const count = useCounterStore((s) => s.count);
  const increment = useCounterStore((s) => s.increment);
  const decrement = useCounterStore((s) => s.decrement);
  return (
    <CounterControls
      count={count}
      onIncrement={increment}
      onDecrement={decrement}
      onRender={onRender}
      tabColor={COLOR}
    />
  );
}

export default function ZustandScreen() {
  // Only subscribes to stable actions — never re-renders on state changes
  const reset = useCounterStore((s) => s.reset);
  const logRef = useRef<RenderLogRef>(null);

  const addEntry = useCallback((entry: LogEntry) => {
    logRef.current?.addEntry(entry);
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => logRef.current?.clear();
    }, []),
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: COLOR }]}>Zustand</Text>
        <Text style={styles.subtitle}>Selector-based, no Provider needed</Text>
      </View>
      <ScrollView
        nestedScrollEnabled={true}
        style={styles.scroll}
        contentContainerStyle={styles.content}
      >
        <NameInputZustand onRender={addEntry} />
        <CounterControlsZustand onRender={addEntry} />
        <Logger onRender={addEntry} tabColor={COLOR} />
        <RenderLog ref={logRef} />
      </ScrollView>
      <ResetButton
        onReset={() => {
          reset();
          logRef.current?.clear();
        }}
        color={COLOR}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 10,
    flexGrow: 1,
  },
});
