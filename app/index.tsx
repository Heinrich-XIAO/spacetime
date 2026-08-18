import Stopwatch from "@/components/stopwatch";
import type { ComponentType } from "react";
import { View as NativeView } from "react-native";

const View = NativeView as unknown as ComponentType<any>;

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stopwatch />
    </View>
  );
}
