// useRefreshOnFocus.js (JavaScript)
import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useRef } from "react";
export function useRefreshOnFocus(refetch) {
  const firstTimeRef = React.useRef(true);

  useFocusEffect(
    React.useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }
      refetch();
    }, [refetch])
  );
}
