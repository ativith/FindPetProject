import { View, Text, StyleSheet, Image } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { useState, useEffect } from "react";

function MapInPost({ latitude, longitude, pictureUrl }) {
  const INITIAL_REGION = {
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  const [marker, setMarker] = useState(null);
  useEffect(() => {
    if (latitude && longitude) {
      setMarker({ latitude, longitude });
    }
  }, [latitude, longitude]);

  return (
    <View style={{ height: 250, marginVertical: 10 }}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
      >
        <Marker coordinate={marker}>
          <Image
            source={{ uri: pictureUrl }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
            resizeMode="contain"
          />
        </Marker>
      </MapView>
    </View>
  );
}
export default MapInPost;
