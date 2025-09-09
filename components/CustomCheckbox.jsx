import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Checkbox from "expo-checkbox";

export default function CustomCheckbox({
  label,
  value,
  selectedValues,
  setSelectedValues,
}) {
  const toggleValue = () => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

  return (
    <Pressable style={styles.container} onPress={toggleValue}>
      <Checkbox
        value={selectedValues.includes(value)}
        onValueChange={toggleValue}
        color={selectedValues.includes(value) ? "#4630EB" : undefined} // สีตอน checked
      />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 5,
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
  },
});
