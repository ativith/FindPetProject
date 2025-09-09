import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, TextInput } from "react-native";
import UploadImage from "../ีuiverse/uploadImage";
import IconButton from "../components/IconButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import Button from "../components/Button";
import { supabase } from "../lib/supabase";
function AlertFormScreen() {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      setImage(selectedUri);
    }
  };
  async function submitInfo() {
    console.log("กดดเเล้ว");
    if (!image || !description) {
      Alert.alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert("คุณยังไม่ได้ล็อกอิน");
        return;
      }
      const fileExt = image.split(".").pop();
      const fileName = `photo_${Date.now()}.${fileExt}`;
      const arrayBuffer = await fetch(image).then((res) => res.arrayBuffer());

      //upload to bucket
      const { data, error: uploadError } = await supabase.storage
        .from("imagesOfAlert")
        .upload(fileName, arrayBuffer, {
          contentType: "image/jpeg",
          metadata: {
            //ข้อมูลเพิ่มเติมที่เเนบไปกับไฟล์เวลาทำการอัปโหลด เช่น ชื่อเจ้าของ ใช้สำหรับเขียน policy
            owner: user.id, // บอกว่าใครเป็นเจ้าของ
            description: "My photo", // คำอธิบายเพิ่มเติม
          },
        });

      if (uploadError) {
        throw uploadError;
      }

      // ดึง public URL from bucket มาใช้
      const publicUrl = supabase.storage
        .from("imagesOfAlert")
        .getPublicUrl(fileName).data.publicUrl;
      console.log(publicUrl);
      console.log(user.id);
      const { error } = await supabase.from("alert").insert([
        {
          user_id: user.id,
          image_url: publicUrl,
          description: description,
        },
      ]);

      if (error) {
        console.error("❌ Insert error:", error);
        alert("เกิดข้อผิดพลาด: " + error.message);
      } else {
        alert("✅ ส่งข้อมูลสำเร็จ!");
      }
    } catch (e) {
      console.error("🔥 Exception caught:", e);
      alert("เกิดข้อผิดพลาดในระบบ: " + e.message);
    }
  }
  return (
    <View>
      <KeyboardAwareScrollView>
        <UploadImage picture={image}>
          <IconButton
            icon="camera"
            title="choose the image"
            size={15}
            color="black"
            onPress={pickImage}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
            }}
          />
        </UploadImage>
        <TextInput
          style={styles.textbox}
          multiline={true} // เปิดให้พิมพ์หลายบรรทัด
          numberOfLines={4} // ความสูงประมาณ 4 บรรทัด
          placeholder="พิมพ์ข้อความที่นี่..."
          value={description}
          onChangeText={setDescription}
          textAlignVertical="top" // ให้ข้อความเริ่มจากบน
        />
      </KeyboardAwareScrollView>
      <Button title="submit" onPress={submitInfo} />
    </View>
  );
}

export default AlertFormScreen;
const styles = StyleSheet.create({
  textbox: {
    height: 100, // ประมาณ 4 บรรทัด
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
});
