import React, { useContext } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";

import { supabase } from "../lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { timeSince } from "../้helper/timeSince";
import { FlatList } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
function NearLostPet() {
  const navigation = useNavigation();
  const fetchPost = async () => {
    const { data, error } = await supabase
      .from("post")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  const { data, isLoading, error } = useQuery({
    queryKey: ["post", "latestpost"],
    queryFn: fetchPost,
    onSuccess: (data) => {
      console.log(data);
    },
  });
  if (isLoading) return <Text>Loading...</Text>;
  if (error) {
    console.log(error.message);
    return <Text>Cant fetch data</Text>;
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate("detailOfPost", { id: item.id })}
          >
            <Image
              source={{ uri: item.image_url }}
              style={styles.image}
              resizeMode="cover"
            />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.collar}>{item.species}</Text>
            <Text style={styles.time}>{timeSince(item.created_at)}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

export default NearLostPet;
const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  card: {
    width: 180,
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 6,
  },
  collar: {
    fontSize: 14,
    color: "#555",
  },
  time: {
    fontSize: 12,
    color: "gray",
    marginTop: 4,
  },
});
