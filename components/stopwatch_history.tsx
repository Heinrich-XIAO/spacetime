import type { HistoryEntry } from "@/components/stopwatch";
import type { ComponentType } from "react";
import {
  ScrollView as NativeScrollView,
  Text as NativeText,
  View as NativeView,
} from "react-native";

const Text = NativeText as unknown as ComponentType<any>;
const View = NativeView as unknown as ComponentType<any>;
const ScrollView = NativeScrollView as unknown as ComponentType<any>;

export default function StopwatchHistory({ history }: { history: HistoryEntry[] }) {
  return (
    <ScrollView style={{ flex: 1 }}>
      {history.reverse().map((entry, index) => (
        <View key={index} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" }}>
          <Text>{entry.type.toUpperCase()}</Text>
          <Text>{entry.time.toLocaleString()}</Text>
        </View>
      ))}
    </ScrollView>
  );
}