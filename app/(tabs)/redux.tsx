import { useFocusEffect } from "expo-router";
import React, { useCallback, useRef } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import { TAB_COLORS } from "@/constants/colors";
import {
  decrement,
  increment,
  reset,
  RootState,
  setName,
} from "@/store/reduxStore";
import { LogEntry } from "@/types";

import { CounterControls } from "@/components/CounterControls";
import { Logger } from "@/components/Logger";
import { NameInput } from "@/components/NameInput";
import { RenderLog, RenderLogRef } from "@/components/RenderLog";
import { ResetButton } from "@/components/ResetButton";

const COLOR = TAB_COLORS.redux;

// Inner components subscribe to the store directly so the screen root
// does not subscribe — Logger (sibling) won't re-render on state changes.

function NameInputRedux({ onRender }: { onRender: (e: LogEntry) => void }) {
  const dispatch = useDispatch();
  const name = useSelector((s: RootState) => s.counter.name);
  return (
    <NameInput
      value={name}
      onChange={(v) => dispatch(setName(v))}
      onRender={onRender}
      tabColor={COLOR}
    />
  );
}

function CounterControlsRedux({
  onRender,
}: {
  onRender: (e: LogEntry) => void;
}) {
  const dispatch = useDispatch();
  const count = useSelector((s: RootState) => s.counter.count);
  return (
    <CounterControls
      count={count}
      onIncrement={() => dispatch(increment())}
      onDecrement={() => dispatch(decrement())}
      onRender={onRender}
      tabColor={COLOR}
    />
  );
}

export default function ReduxScreen() {
  const dispatch = useDispatch();
  const logRef = useRef<RenderLogRef>(null);

  // addEntry writes into RenderLog's own state — never re-renders this screen
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
        <Text style={[styles.title, { color: COLOR }]}>Redux</Text>
        <Text style={styles.subtitle}>
          Only useSelector subscribers re-render
        </Text>
      </View>
      <ScrollView
        nestedScrollEnabled={true}
        style={styles.scroll}
        contentContainerStyle={styles.content}
      >
        <NameInputRedux onRender={addEntry} />
        <CounterControlsRedux onRender={addEntry} />
        <Logger onRender={addEntry} tabColor={COLOR} />
        <RenderLog ref={logRef} />
      </ScrollView>
      <ResetButton
        onReset={() => {
          dispatch(reset());
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
