import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FindPetScreen from "../screens/FindPetScreen";
function Fourbanner({ iconName, label, size, color, navigateTo }) {
  const navigation = useNavigation();
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.buttonPressed,
      ]}
      onPress={() => navigation.navigate(navigateTo)}
    >
      <View style={styles.row}>
        <MaterialIcons name={iconName} size={size} color={color} />
        <Text style={styles.text}>{label}</Text>
      </View>
    </Pressable>
  );
}

export default Fourbanner;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: "#dda15e", // สีหลัก
    borderRadius: 12,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 3, // สำหรับ Android
    gap: 12,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonPressed: {
    opacity: 0.6,
    transform: [{ scale: 0.97 }],
  },
});
