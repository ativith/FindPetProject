import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import SearchPopUp from "../screens/SearchPopUp";
import { useNavigation } from "@react-navigation/native";
function SearchBar({ onPress }) {
  const navigation = useNavigation();
  return (
    <Pressable style={styles.root} onPress={onPress}>
      <AntDesign
        name="search1"
        size={24}
        color="black"
        style={{ marginRight: 8 }}
      />
      <Text style={styles.text}>search</Text>
      <AntDesign name="filter" size={24} color="black" />
    </Pressable>
  );
}

export default SearchBar;
const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "white",
    alignItems: "center",
  },
  text: {
    flex: 1,
    color: "grey",
  },
});
