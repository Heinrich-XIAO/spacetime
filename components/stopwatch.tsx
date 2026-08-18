import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import { Button, Text as NativeText, View as NativeView } from "react-native";

const Text = NativeText as unknown as ComponentType<any>;
const View = NativeView as unknown as ComponentType<any>;

type HistoryEntry = {
  type: "start" | "lap" | "pause" | "unpause" | "stop";
  time: Date;
};

export default function Stopwatch() {
  const [displayTime, setDisplayTime] = useState("0.00");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const isRunning = history.some((entry) => entry.type === "start" || entry.type === "unpause") && !history.some((entry) => entry.type === "stop" || entry.type === "pause");

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      let total_elapsed = 0;
      for (const entry of history) {
        if (entry.type === "lap" || entry.type === "pause" || entry.type === "stop") {
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


  const startStopwatch = () => {
    setHistory([{ type: "start", time: new Date() }]);
  };

  const lapStopwatch = () => {
    setHistory((prev) => [...prev, { type: "lap", time: new Date() }]);
  };

  const stopStopwatch = () => {
    setHistory((prev) => [...prev, { type: "stop", time: new Date() }]);
  };

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
      }}
    >
      <Text
        style={{
          fontSize: 96,
          fontWeight: "bold",
          fontFamily: "monospace",
          marginBottom: 20,
          width: "100%",
          textAlign: "center"
        }}
      >
        {displayTime}
      </Text>
      {isRunning || <Button title="Start" onPress={startStopwatch} />}
      {isRunning && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            paddingHorizontal: 20
          }}
        >
          <Button title="Pause" onPress={stopStopwatch} />
          <Button title="Stop" onPress={stopStopwatch} />
          <Button title="Lap" onPress={lapStopwatch} />
        </View>
      )}
    </View>
  );
}
