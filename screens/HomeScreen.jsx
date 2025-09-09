import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  StatusBar,
} from "react-native";
import Alert from "../Banner/Alert";
import Fourbanner from "../Banner/Fourbanner";
import NearLostPet from "../Banner/NearLostPet";

function HomeScreen() {
  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <Alert />
      <View style={styles.allBannerContainer}>
        <View style={styles.item}>
          <Fourbanner
            iconName="search"
            size={40}
            color="black"
            label="ตามหาสัตว์"
            navigateTo="StupidPet"
          />
        </View>
        <View style={styles.item}>
          <Fourbanner
            iconName="pets"
            size={40}
            color="black"
            label="เเจ้งเตือนฉุกเฉิน"
            navigateTo="AlertFormScreen"
          />
        </View>
        <View style={styles.item}>
          <Fourbanner
            iconName="add"
            size={40}
            color="black"
            label="เเจ้งประกาศ"
            navigateTo="AddNewPost"
          />
        </View>
        <View style={styles.item}>
          <Fourbanner
            iconName="place"
            size={40}
            color="black"
            label="radar"
            navigateTo="Radar"
          />
        </View>
      </View>
      <View>
        <Text style={styles.name}>Lastest Posts</Text>
        <NearLostPet />
      </View>
    </ScrollView>
  );
}

export default HomeScreen;
const styles = StyleSheet.create({
  allBannerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
    marginHorizontal: 10,
  },
  item: {
    width: "48%",
    marginVertical: 5,
  },
  alllost: {
    borderRadius: 6,
    borderWidth: 0,
    backgroundColor: "#dda15e",
    marginHorizontal: 5,
    marginVertical: 10,
    padding: 6,
  },
  lostPet: {
    marginHorizontal: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 6,
    marginHorizontal: 6,
  },
});
