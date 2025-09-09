import React, { useState } from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
function Input({
  value,
  placeholder,
  label,
  updateValue,
  type,
  onPressIn,
  disabled,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const isPassword = type === "password";
  return (
    <View>
      <Text>{label}</Text>
      <View style={styles.container}>
        <TextInput
          style={[styles.inputBox, disabled && { backgroundColor: "grey" }]}
          value={value}
          placeholder={placeholder}
          onChangeText={updateValue}
          autoCapitalize="none"
          secureTextEntry={type === "password" && !showPassword}
          onPressIn={onPressIn}
          editable={!disabled}
        />
        {isPassword && (
          <FontAwesome
            name={showPassword ? "eye" : "eye-slash"}
            size={20}
            color="gray"
            onPress={toggleShowPassword}
          />
        )}
      </View>
    </View>
  );
}
export default Input;
const styles = StyleSheet.create({
  container: { flexDirection: "row" },
  inputBox: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
  },
});
