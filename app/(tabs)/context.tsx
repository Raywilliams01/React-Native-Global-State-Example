import { useFocusEffect } from "expo-router";
import React, { useCallback, useRef } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TAB_COLORS } from "@/constants/colors";
import { CounterProvider, useCounterContext } from "@/store/contextStore";
import { LogEntry } from "@/types";

import { CounterControls } from "@/components/CounterControls";
import { Logger } from "@/components/Logger";
import { NameInput } from "@/components/NameInput";
import { RenderLog, RenderLogRef } from "@/components/RenderLog";
import { ResetButton } from "@/components/ResetButton";

const COLOR = TAB_COLORS.context;

// ContextScreenContent calls useCounterContext() — so it re-renders whenever
// ANY part of the context value changes.  All children (including Logger)
// re-render with it, demonstrating Context's all-consumers-re-render behaviour.
function ContextScreenContent() {
  const { state, setName, increment, decrement, reset } = useCounterContext();
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
        <Text style={[styles.title, { color: COLOR }]}>Context</Text>
        <Text style={styles.subtitle}>
          All consumers re-render on every change
        </Text>
      </View>
      <ScrollView
        nestedScrollEnabled={true}
        style={styles.scroll}
        contentContainerStyle={styles.content}
      >
        <NameInput
          value={state.name}
          onChange={setName}
          onRender={addEntry}
          tabColor={COLOR}
        />
        <CounterControls
          count={state.count}
          onIncrement={increment}
          onDecrement={decrement}
          onRender={addEntry}
          tabColor={COLOR}
        />
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

export default function ContextScreen() {
  return (
    <CounterProvider>
      <ContextScreenContent />
    </CounterProvider>
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
