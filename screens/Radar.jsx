import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useNavigation } from "@react-navigation/native";
function Radar() {
  const [location, setLocation] = useState(null);
  const navigation = useNavigation();
  const hee = location
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : {
        latitude: 13.7563, // ค่า default
        longitude: 100.5018,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("can not access");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }, []);
  console.log(location);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("post")
      .select("latitude, longitude,image_url,id");
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  const { data, isFetching, error, isError } = useQuery({
    queryKey: ["markers", location],
    queryFn: () => fetchData(),
  });
  if (isFetching) {
    return <Text>Loading</Text>;
  }
  if (isError) {
    return <Text>{error.message}</Text>;
  }
  console.log(data);

  return (
    <View style={{ width: "100%", height: "90%" }}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={hee}
        showsUserLocation
        showsMyLocationButton
      >
        {data.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            onPress={() =>
              navigation.navigate("detailOfPost", { id: marker.id })
            }
          >
            <View>
              <Image
                source={{ uri: marker.image_url }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
                resizeMode="contain"
              />
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

export default Radar;
