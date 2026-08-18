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
  const historyDisplay = [];
  for (let i = history.length - 1; i >= 0; i--) {
    const entry = history[i];
    if (entry.type === "start" || entry.type === "end") {
      historyDisplay.push(
        <View key={i} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" }}>
          <Text>{entry.type.toUpperCase()}</Text>
          <Text>{entry.time.toLocaleString()}</Text>
        </View>
      );
      break;
    }
    if (entry.type === "pause" && i === history.length - 1) {
      historyDisplay.push(
        <View key={i} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" }}>
          <Text>{entry.type.toUpperCase()}</Text>
          <Text>{entry.time.toLocaleString()}</Text>
        </View>
      );
    }
    if (entry.type === "unpause") {
      historyDisplay.push(
        <View key={i} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" }}>
          <Text>{`PAUSED FOR ${Math.floor((entry.time.getTime() - history[history.indexOf(entry) - 1].time.getTime())/10)/100} seconds`}</Text>
          <Text>{entry.time.toLocaleString()}</Text>
        </View>
      );
    }
    if (entry.type === "lap") {
      historyDisplay.push(
        <View key={i} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" }}>
          <Text>{`LAP ${history.filter(e => e.type === "lap").indexOf(entry) + 1}`}</Text>
          <Text>{entry.time.toLocaleString()}</Text>
        </View>
      );
    }
  }
  return (
    <ScrollView style={{ flex: 1 }}>
      {historyDisplay}
    </ScrollView>
  );
}
