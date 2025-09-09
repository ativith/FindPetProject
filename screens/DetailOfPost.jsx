import React from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from "react-native";
import { supabase } from "../lib/supabase";
import { useQuery } from "@tanstack/react-query";
import MapInPost from "../components/MapInPost";
import Button from "../components/Button";
import { useChatContext } from "stream-chat-expo";
import { useAuth } from "../provider/AuthProvider";

function DetailOfPost({ route, navigation }) {
  const { client } = useChatContext();
  const { user: me } = useAuth();
  const { id } = route.params;

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from("post")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["post", id],
    queryFn: fetchPost,
  });

  if (isLoading) return <Text style={styles.loading}>Loading...</Text>;
  if (error) return <Text style={styles.error}>Error: {error.message}</Text>;

  async function contactOwnerPost() {
    const channel = client.channel("messaging", {
      members: [me.id, data.user_id],
    });
    await channel.watch();
    navigation.navigate("ChatDetail", { channelId: channel.cid });
  }

  return (
    <ScrollView style={styles.root}>
      {/* Card */}
      <View style={styles.card}>
        <Image source={{ uri: data?.image_url }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{data?.name}</Text>
          <Text style={styles.label}>
            สายพันธุ์: <Text style={styles.value}>{data?.species}</Text>
          </Text>
          <Text style={styles.label}>
            สี: <Text style={styles.value}>{data?.color}</Text>
          </Text>
          {data?.age && (
            <Text style={styles.label}>
              อายุ: <Text style={styles.value}>{data.age}</Text>
            </Text>
          )}
          <Text style={styles.label}>
            ปลอกคอ: <Text style={styles.value}>{data?.collar}</Text>
          </Text>
          <Text style={styles.label}>
            หายเมื่อ: <Text style={styles.value}>{data?.lost_date}</Text>
          </Text>
          {data?.reward && (
            <Text style={styles.label}>
              รางวัล: <Text style={styles.value}>{data.reward}</Text>
            </Text>
          )}
        </View>
      </View>

      {/* Details */}
      <View style={styles.section}>
        {data?.detail && (
          <>
            <Text style={styles.sectionTitle}>รายละเอียด</Text>
            <Text style={styles.sectionText}>{data.detail}</Text>
          </>
        )}
        {data?.highlight && (
          <>
            <Text style={styles.sectionTitle}>จุดสังเกต</Text>
            <Text style={styles.sectionText}>{data.highlight}</Text>
          </>
        )}
      </View>

      {/* Location */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>สถานที่หาย</Text>
        <Text style={styles.sectionText}>{data.location}</Text>
        <MapInPost
          latitude={data.latitude}
          longitude={data.longitude}
          pictureUrl={data.image_url}
        />
      </View>

      {/* Contact button */}
      <Button
        title="ติดต่อเจ้าของโพสต์"
        onPress={contactOwnerPost}
        style={styles.button}
      />
    </ScrollView>
  );
}

export default DetailOfPost;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f9f9f9", // 🔹 เปลี่ยน background เป็นสีอ่อน
    paddingVertical: 10,
  },
  loading: {
    textAlign: "center",
    marginTop: 20,
    color: "#555",
  },
  error: {
    textAlign: "center",
    marginTop: 20,
    color: "red",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff", // 🔹 card สีขาว
    marginHorizontal: 15, // 🔹 spacing รอบ card
    marginVertical: 10,
    borderRadius: 12, // 🔹 card มน
    padding: 15, // 🔹 เพิ่ม padding
    shadowColor: "#000", // 🔹 เพิ่ม shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4, // สำหรับ Android
  },
  image: {
    width: 120,
    height: 160,
    borderRadius: 12, // 🔹 มน
    marginRight: 15,
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 20, // 🔹 ขนาดใหญ่
    fontWeight: "700", // 🔹 หนา
    color: "#333",
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 3,
  },
  value: {
    fontWeight: "400",
    color: "#666", // 🔹 ค่าเป็นสีเทาอ่อน
  },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    borderRadius: 12, // 🔹 มนเหมือน card
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 5,
  },
  button: {
    marginHorizontal: 15,
    marginVertical: 15,
  },
});
