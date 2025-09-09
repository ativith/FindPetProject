import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

const screenWidth = Dimensions.get("window").width;

function Alert() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from("alert")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["alert", "latest"],
    queryFn: fetchPost,
  });

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Can't fetch data</Text>;
  if (!data || data.length === 0) return <Text>No alerts</Text>;

  const currentCard = data[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % data.length);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handleNext} style={styles.card}>
        <Image source={{ uri: currentCard.image_url }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>ประกาศฉุกเฉิน</Text>
          <Text style={styles.description}>{currentCard.description}</Text>
        </View>
      </Pressable>

      {/* Indicator */}
      <View style={styles.indicatorContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentIndex === index && styles.activeIndicator, //ถ้า true จะคืนค่า styles.activeIndicator
            ]}
          />
        ))}
      </View>
    </View>
  );
}

export default Alert;

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    alignItems: "center",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#1f1f1f",
    borderRadius: 16,
    width: screenWidth * 0.9,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8, // สำหรับ Android
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 16,
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFD700",
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    color: "#E0E0E0",
    lineHeight: 20,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  indicator: {
    width: 10,
    height: 4,
    backgroundColor: "#555",
    marginHorizontal: 5,
    borderRadius: 2,
    opacity: 0.5,
  },
  activeIndicator: {
    backgroundColor: "#FFD700",
    width: 20,
    opacity: 1,
  },
  loading: {
    marginTop: 20,
    color: "#888",
    fontSize: 16,
  },
});
