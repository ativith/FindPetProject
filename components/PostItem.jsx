import React from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import IconButton from "./IconButton";
import { supabase } from "../lib/supabase";
import { useQuery } from "@tanstack/react-query";

function PostItem({ id, user_id, image_url, name, species, reward, location }) {
  const navigation = useNavigation();
  const fecthUser = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("username,last_name,avatar_url")
      .eq("id", user_id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  };
  const { data, error, isLoading } = useQuery({
    queryKey: ["user", user_id],
    queryFn: () => fecthUser(),
  });

  return (
    <View>
      <Pressable
        style={({ pressed }) => [
          styles.container,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => navigation.navigate("detailOfPost", { id })}
      >
        <View style={styles.row}>
          <Image source={{ uri: image_url }} style={styles.picture} />
          <View style={styles.detail}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.text}>
              <Text style={styles.headers}>สายพันธุ์:</Text> {species}
            </Text>
            {reward ? (
              <Text style={styles.text}>
                <Text style={styles.headers}>รางวัล:</Text> {reward}
              </Text>
            ) : null}
            <Text style={styles.text}>
              <Text style={styles.headers}>สถานที่หาย:</Text> {location}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {isLoading ? (
            <Text style={styles.loading}>กำลังโหลด...</Text>
          ) : error ? (
            <Text style={styles.error}>Error: {error.message}</Text>
          ) : (
            <>
              <Text style={styles.byText}>โพสต์โดย:</Text>
              <Image
                source={{ uri: data?.avatar_url }}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  alignSelf: "center",
                  marginRight: 5,
                }}
              />

              <Text style={styles.username}>{data?.username}</Text>
            </>
          )}
        </View>

        <View style={styles.divider} />
      </Pressable>
    </View>
  );
}

export default PostItem;

const styles = StyleSheet.create({
  container: {
    borderRadius: 12, // 🔹 เพิ่มให้ card มน
    backgroundColor: "#fff", // 🔹 เปลี่ยนเป็นสีขาวดูสะอาด
    flex: 1,
    justifyContent: "center",
    marginVertical: 10, // 🔹 เพิ่มระยะระหว่าง card
    marginHorizontal: 15, // 🔹 เพิ่ม margin ซ้ายขวา
    shadowColor: "#000", // 🔹 เพิ่ม shadow ให้ดูลอย
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // 🔹 สำหรับ Android
  },
  row: {
    flexDirection: "row",
  },
  picture: {
    width: 100,
    height: 100,
    borderRadius: 50, // 🔹 ทำเป็นวงกลม
    margin: 10,
    borderWidth: 1, // 🔹 เพิ่มเส้นขอบบาง ๆ
    borderColor: "#e0e0e0",
  },
  detail: {
    flex: 1,
    flexShrink: 1,
    paddingHorizontal: 5,
    justifyContent: "center",
  },
  name: {
    fontSize: 18, // 🔹 เพิ่มขนาด font
    fontWeight: "700", // 🔹 หนาขึ้น
    color: "#333", // 🔹 modern dark gray
    marginBottom: 5,
  },
  headers: {
    fontWeight: "600",
    color: "#555", // 🔹 สีเทาเข้มสำหรับ label
  },
  text: {
    fontSize: 14,
    color: "#666", // 🔹 สีเทาอ่อนสำหรับ detail
    marginBottom: 3,
  },
  buttonPressed: {
    opacity: 0.6, // 🔹 เปลี่ยนให้ดู modern กว่า
  },
  divider: {
    height: 1,
    alignSelf: "center",
    backgroundColor: "#e0e0e0", // 🔹 สี divider อ่อน
    marginTop: 15,
    width: "90%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  iconButton: {
    backgroundColor: "#DDA15E", // 🔹 เปลี่ยนสีปุ่มให้ดูสวย modern
    borderRadius: 8, // 🔹 ปุ่มมน
    paddingHorizontal: 15,
    paddingVertical: 6,
  },
  loading: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
  error: {
    fontSize: 12,
    color: "red",
  },
  byText: {
    fontSize: 12,
    color: "#555",
    marginRight: 6,
  },
  username: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
});
