import React, { useEffect, useState } from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import { useRef } from "react";
import { useNavigation } from "@react-navigation/native";

const INITIAL_REGION = {
  latitude: 13.7563,
  longitude: 100.5018,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

function Map({ setLongitude, setLatitude }) {
  const mapRef = useRef(null);
  const [marker, setMarker] = useState(null);
  const navigation = useNavigation();
  const onRegionChange = (region) => {
    console.log(region);
  };
  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setMarker(coordinate); // เก็บลง state
    console.log("เลือกพิกัด: ", coordinate); // coordinate.latitude, coordinate.longitude
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLatitude(latitude);
    setLongitude(longitude);
  };
  return (
    <View style={{ height: 250, marginVertical: 10 }}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton
        ref={mapRef}
        onRegionChangeComplete={onRegionChange}
        onPress={handleMapPress}
      >
        {marker && <Marker coordinate={marker} draggable />}
      </MapView>
    </View>
  );
}
export default Map;
