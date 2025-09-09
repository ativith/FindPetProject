import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
function IconButton({ icon, title, size, color, style, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        style,
        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
    >
      <MaterialIcons name={icon} size={size} color={color} />
      <Text>{title}</Text>
    </Pressable>
  );
}

export default IconButton;
const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    padding: 6,
    borderWidth: 0,
    flexDirection: "row",
    alignItems: "center", //rgba(160, 243, 160, 0.45)
    backgroundColor: "rgba(255, 99, 71, 0.3)",
    alignSelf: "flex-start", //เอาไว้เเก้เวลา ปุ่มอยู่่ในparent view ที่มี flex1
  },
  buttonPressed: {
    opacity: 0.3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
