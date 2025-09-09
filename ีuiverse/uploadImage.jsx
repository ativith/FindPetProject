import { View, Text, StyleSheet, Image } from "react-native";
import React, { useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
function UploadImage({ picture, children }) {
  return (
    <View style={styles.wrapper}>
      {picture ? (
        // ถ้ามีรูป ให้แสดงรูปภาพเต็มพื้นที่
        <Image
          source={{ uri: picture }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        // ถ้ายังไม่มีรูป ให้แสดงไอคอน+ข้อความปกติ
        <>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="file-image-plus"
              size={50}
              color="black"
            />
          </View>
          <View style={styles.iconContainer}>
            <Text style={styles.uploadText}></Text>
          </View>
        </>
      )}
      {children}
    </View>
  );
}

export default UploadImage;
const styles = StyleSheet.create({
  wrapper: {
    height: 300,
    width: 300,
    alignItems: "center",
    justifyContent: "center",

    borderWidth: 2,
    borderColor: "#cacaca",
    backgroundColor: "rgba(255, 255, 255, 1)",
    //padding: 24,
    borderRadius: 10,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    position: "relative",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  uploadText: {
    fontWeight: "400",
    color: "rgba(75, 85, 99, 1)",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});

/*export const StyledWrapper = styled.TouchableOpacity`
  height: 200px;
  width: 300px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px; /* ❗️ React Native ยังไม่รองรับ gap โดยตรง (อธิบายด้านล่าง) 
  border: 2px dashed #cacaca;
  background-color: rgba(255, 255, 255, 1);
  padding: 24px;
  border-radius: 10px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
 


export const IconContainer = styled.View`
  justify-content: center;
  align-items: center;


////*export const UploadTextContainer = styled.View
  justify-content: center;
  align-items: center;


/*export const UploadText = styled.Text`
  font-weight: 400;
  color: rgba(75, 85, 99, 1) */ ///
