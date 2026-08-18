import StopwatchHistory from "@/components/stopwatch_history";
import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import type { TextProps, ViewProps } from "react-native";
import {
  Button,
  Text as NativeText,
  View as NativeView,
} from "react-native";

const Text = NativeText as unknown as ComponentType<TextProps>;
const View = NativeView as unknown as ComponentType<ViewProps>;
const DISPLAY_HORIZONTAL_PADDING = 20;

export type HistoryEntry = {
  type: "start" | "lap" | "pause" | "unpause" | "end";
  time: Date;
};

export default function Stopwatch() {
  const [displayTime, setDisplayTime] = useState("0.00");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [timeFontSize, setTimeFontSize] = useState(96);
  const [displayWidth, setDisplayWidth] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      let total_elapsed = 0;
      for (const entry of history) {
        if (entry.type === "lap" || entry.type === "pause" || entry.type === "end") {
          total_elapsed += entry.time.getTime() - (history[history.indexOf(entry) - 1]?.time.getTime() ?? 0);
        }
      }
      total_elapsed += new Date().getTime() - (history[history.length - 1]?.time.getTime() ?? 0);
      
      if (total_elapsed > 24 * 60 * 60 * 1000) {
        const days = Math.floor(total_elapsed / (24 * 60 * 60 * 1000));
        const hours = Math.floor((total_elapsed % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((total_elapsed % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((total_elapsed % (60 * 1000)) / 1000);
        const hundredths_seconds = Math.floor(total_elapsed % 1000 / 10);
        setDisplayTime(`${days}d ${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${hundredths_seconds.toString().padStart(2, "0")}`);
      } else if (total_elapsed > 60 * 60 * 1000) {
        const hours = Math.floor(total_elapsed / (60 * 60 * 1000));
        const minutes = Math.floor((total_elapsed % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((total_elapsed % (60 * 1000)) / 1000);
        const hundredths_seconds = Math.floor(total_elapsed % 1000 / 10);
        setDisplayTime(`${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${hundredths_seconds.toString().padStart(2, "0")}`);
      } else if (total_elapsed > 60 * 1000) {
        const minutes = Math.floor(total_elapsed / (60 * 1000));
        const seconds = Math.floor((total_elapsed % (60 * 1000)) / 1000);
        const hundredths_seconds = Math.floor(total_elapsed % 1000 / 10);
        setDisplayTime(`${minutes}:${seconds.toString().padStart(2, "0")}.${hundredths_seconds.toString().padStart(2, "0")}`);
      } else {
        const seconds = Math.floor(total_elapsed / 1000);
        const hundredths_seconds = Math.floor(total_elapsed % 1000 / 10);
        setDisplayTime(`${seconds}.${hundredths_seconds.toString().padStart(2, "0")}`);
      }
    }, 10);
    return () => clearInterval(interval);
  }, [isRunning, history]);

  useEffect(() => {
    console.log(history);
  }, [history]);

  const startStopwatch = () => {
    setHistory([{ type: "start", time: new Date() }]);
    setIsRunning(true);
  };

  const pauseStopwatch = () => {
    setHistory((prev) => [...prev, { type: "pause", time: new Date() }]);
    setIsRunning(false);
  };

  const resumeStopwatch = () => {
    setHistory((prev) => [...prev, { type: "unpause", time: new Date() }]);
    setIsRunning(true);
  };

  const lapStopwatch = () => {
    setHistory((prev) => [...prev, { type: "lap", time: new Date() }]);
  };

  const endStopwatch = () => {
    setHistory((prev) => [...prev, { type: "end", time: new Date() }]);
    setIsRunning(false);
  };

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <View
        onLayout={(event) =>
          setDisplayWidth(event.nativeEvent.layout.width - DISPLAY_HORIZONTAL_PADDING * 2)
        }
        style={{
          width: "100%",
          paddingHorizontal: DISPLAY_HORIZONTAL_PADDING,
        }}
      >
        <Text
          style={{
            fontSize: timeFontSize,
            fontWeight: "bold",
            fontFamily: "monospace",
            marginBottom: 20,
            width: "100%",
            textAlign: "center",
          }}
          numberOfLines={1}
          ellipsizeMode="clip"
          onTextLayout={(event) => {
            const lineWidth = event.nativeEvent.lines?.[0]?.width;
            if (!displayWidth || !lineWidth) return;

            const nextFontSize = Math.max(
              12,
              Math.min(240, timeFontSize * displayWidth / lineWidth),
            );
            if (Math.abs(nextFontSize - timeFontSize) > 0.5) {
              setTimeFontSize(nextFontSize);
            }
          }}
        >
          {displayTime}
        </Text>
      </View>
      {history.length === 0 && (
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            paddingHorizontal: 20,
            gap: 8,
          }}
        >
          <View style={{ flex: 1 }}>
            <Button title="Start" onPress={startStopwatch} />
          </View>
        </View>
      )}
      {history.at(-1)?.type == "pause" && (
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            paddingHorizontal: 20,
            gap: 8,
          }}
        >
          <View style={{ flex: 1 }}>
            <Button title="Resume" onPress={resumeStopwatch} />
          </View>
          <View style={{ flex: 1 }}>
            <Button title="End" onPress={endStopwatch} />
          </View>
        </View>
      )}
      {isRunning && (
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            paddingHorizontal: 20,
            gap: 8,
          }}
        >
          <View style={{ flex: 1 }}>
            <Button title="Pause" onPress={pauseStopwatch} />
          </View>
          <View style={{ flex: 1 }}>
            <Button title="End" onPress={endStopwatch} />
          </View>
          <View style={{ flex: 1 }}>
            <Button title="Lap" onPress={lapStopwatch} />
          </View>
        </View>
      )}

      <StopwatchHistory history={history} />
    </View>
  );
}
