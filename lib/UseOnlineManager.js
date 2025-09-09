import { useEffect } from "react";
import { AppState, Platform } from "react-native";
import { focusManager } from "@tanstack/react-query";

export function useOnlineManager() {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (Platform.OS !== "web") {
        focusManager.setFocused(state === "active");
      }
    });
    return () => subscription.remove();
  }, []);
}
