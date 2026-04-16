import { LogEntry } from "@/types";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export interface RenderLogRef {
  addEntry: (entry: LogEntry) => void;
  clear: () => void;
}

// RenderLog owns its own log state so that appending entries does NOT
// re-render the parent screen — which would otherwise create an infinite loop
// of: parent renders → children's useEffects fire → addEntry → parent renders → …
export const RenderLog = forwardRef<RenderLogRef>((_, ref) => {
  const [entries, setEntries] = useState<LogEntry[]>([]);

  useImperativeHandle(ref, () => ({
    addEntry: (entry) => setEntries((prev) => [entry, ...prev].slice(0, 50)),
    clear: () => setEntries([]),
  }));

  return (
    <View style={styles.wrapper}>
      <Text style={styles.legend}>
        Components flash and log here on every re-render
      </Text>
      <View style={styles.logBox}>
        <FlatList
          data={entries}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.row,
                { backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F3F4F6" },
              ]}
            >
              <Text style={styles.componentName}>{item.component}</Text>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No renders logged yet</Text>
          }
        />
      </View>
    </View>
  );
});

RenderLog.displayName = "RenderLog";

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    minHeight: 200,
  },
  legend: {
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 6,
    fontStyle: "italic",
  },
  logBox: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  componentName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  timestamp: {
    fontSize: 12,
    color: "#9CA3AF",
    fontVariant: ["tabular-nums"],
  },
  empty: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 13,
    padding: 20,
  },
});
