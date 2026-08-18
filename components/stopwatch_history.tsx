import type { HistoryEntry } from "@/components/stopwatch";
import type { ComponentType } from "react";
import type { ScrollViewProps, TextProps, ViewProps } from "react-native";
import {
  ScrollView as NativeScrollView,
  Text as NativeText,
  View as NativeView,
} from "react-native";

const Text = NativeText as unknown as ComponentType<TextProps>;
const View = NativeView as unknown as ComponentType<ViewProps>;
const ScrollView = NativeScrollView as unknown as ComponentType<ScrollViewProps>;

export default function StopwatchHistory({ history }: { history: HistoryEntry[] }) {
  return (
    <ScrollView style={{ flex: 1 }}>
      {history.toReversed().map((entry, index) => (
        <View key={index} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" }}>
          <Text>{entry.type.toUpperCase()}</Text>
          <Text>{entry.time.toLocaleString()}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
