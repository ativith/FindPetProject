import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Pressable,
  SafeAreaView,
  Platform,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import IconButton from "../components/IconButton";
import UploadImage from "../ีuiverse/uploadImage";
import Input from "../components/Input";
import Button from "../components/Button";
import Map from "../components/MapView";
import { supabase } from "../lib/supabase";
import { convertToDateISO } from "../้helper/convertToDate";
import CustomDropdown from "../components/CustomDropDown";
import CustomCheckbox from "../components/CustomCheckbox";
import {
  petOptions,
  sexOptions,
  haveCollar,
  colorOptions,
  postOptions,
} from "../variable/option";
function AddNewPost() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");

  const [age, setAge] = useState("");
  const [reward, setReward] = useState("");
  const [collar, setCollar] = useState(""); //ปลอกคอ
  const [details, setDetails] = useState("");
  const [highlight, setHighlight] = useState(""); //จุดเด่น
  const [dateLost, setDateLost] = useState(null);
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [type, setType] = useState(null);
  const [sex, setSex] = useState(null);

  const [speciesOptions, setSpeciesOptions] = useState([]);
  const [typeOfPost, setTypeOfPost] = useState();

  useEffect(() => {
    if (type) {
      setSpeciesOptions(
        petOptions[type].breeds.map((sp) => ({
          label: sp.label,
          value: sp.value,
        }))
      );
      setSpecies(null); // reset ค่าเก่า
    }
  }, [type]);

  const [selectedColors, setSelectedColors] = useState([]);

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
    console.log("กดเเล้ว");
    if (
      !image ||
      !typeOfPost ||
      !name ||
      !type ||
      !species ||
      !selectedColors ||
      !collar ||
      !details ||
      !location ||
      !sex
    ) {
      Alert.alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      console.log(เช็คฟอร์ม);
      return;
    }
    if (typeOfPost === "findpet") {
      if (!age || !reward || !highlight || !dateLost) {
        Alert.alert("กรุณากรอกข้อมูลให้ครบถ้วนสำหรับโพสต์ตามหาสัตว์หาย");
        return;
      }
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
        .from("images")
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
      const publicUrl = supabase.storage.from("images").getPublicUrl(fileName)
        .data.publicUrl;
      console.log(publicUrl);

      const { error } = await supabase.from("post").insert([
        {
          user_id: user.id,
          image_url: publicUrl,
          name,
          type,
          species,
          color: selectedColors,
          age: age ? parseInt(age) : null,
          collar,
          detail: details,
          highlight: highlight ? highlight : null,
          lost_date: dateLost ? convertToDateISO(dateLost) : null,
          location,
          latitude,
          longitude,
          reward: reward ? reward : null,
          sex,
          typeofpost: typeOfPost,
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
    <SafeAreaView>
      <KeyboardAwareScrollView>
        <View style={styles.container}>
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
        </View>
        <View style={styles.inputContainer}>
          <Text>เลือกประเภทของโพสต์</Text>
          <CustomDropdown
            value={typeOfPost}
            setValue={setTypeOfPost}
            items={postOptions}
            placeholder="ประเภทของโพสต์"
            zIndex={3000}
          />
          <Input
            value={name}
            placeholder="ระบุชื่อสัตว์"
            label="ชื่อสัตว์เลี้ยง"
            updateValue={(text) => setName(text)}
          />
          <Text>ประเภทของสัตว์</Text>
          <CustomDropdown
            value={type}
            setValue={setType}
            items={Object.keys(petOptions).map((pet) => ({
              label: petOptions[pet].label,
              value: pet,
            }))}
            placeholder="ประเภทของสัตว์"
            zIndex={2500}
          />
          <Text>สายพันธุ์</Text>
          <CustomDropdown
            value={species}
            setValue={setSpecies}
            items={speciesOptions}
            placeholder="สายพันธุ์"
            zIndex={2000}
          />
          <Text>เพศ</Text>
          <CustomDropdown
            value={sex}
            setValue={setSex}
            items={sexOptions}
            zIndex={1500}
          />
          {typeOfPost === "findpet" && (
            <>
              <Input
                value={age}
                placeholder="2ปี"
                label="อายุ"
                updateValue={(text) => setAge(text)}
              />
              <Input
                value={reward}
                placeholder="2000บาท"
                label="รางวัล"
                updateValue={(text) => setReward(text)}
              />

              <Input
                value={highlight}
                placeholder="หางยาวปลายงอ หูซ้ายมีรอยเเหว่ง"
                label="จุดสังเกต"
                updateValue={(text) => setHighlight(text)}
              />

              <Input
                value={dateLost}
                placeholder="05/07/2025"
                label="วันที่หาย"
                updateValue={(text) => setDateLost(text)}
              />
            </>
          )}
          <Text>ปลอกคอ</Text>
          <CustomDropdown
            value={collar}
            setValue={setCollar}
            items={haveCollar}
            zIndex={1000}
          />
          <Input
            value={details}
            placeholder=""
            label="รายละเอียดการหาย"
            updateValue={(text) => setDetails(text)}
          />

          <Input
            value={location}
            placeholder=""
            label="สถานที่หาย"
            updateValue={(text) => setLocation(text)}
          />
        </View>
        <Text>เลือกสี</Text>
        <View style={styles.checkBoxContainer}>
          {colorOptions.map((color) => (
            <CustomCheckbox
              key={color.key} // ใช้ color.key เป็น key
              label={color.label} // แสดงสีไทย
              value={color.key} // เก็บค่าเป็น key ภาษาอังกฤษ
              selectedValues={selectedColors}
              setSelectedValues={setSelectedColors}
            />
          ))}
        </View>
        <Text>สีที่เลือก: {selectedColors.join(", ")}</Text>
        <Map setLatitude={setLatitude} setLongitude={setLongitude} />
        <View style={{ alignSelf: "flex-end", margin: 10 }}>
          <Button title="Post" onPress={submitInfo} />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

export default AddNewPost;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  image: {
    width: 200,
    height: 200,
  },
  inputContainer: {
    marginHorizontal: 10,
    marginTop: 15,
  },
  checkBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",

    flexWrap: "wrap",
    marginHorizontal: 20,
  },
});
