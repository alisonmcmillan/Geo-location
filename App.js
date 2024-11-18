import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    (async () => {
      // Ask for permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      setPermissionGranted(true);

      // Get the current location
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  if (!permissionGranted) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Dummy data for a nearby restaurant
  const nearbyRestaurant = {
    name: "Nearby Bistro",
    latitude: location.latitude + 0.005, // Just an example location
    longitude: location.longitude + 0.005,
  };

  return (
    <View style={styles.container}>
      <Text>Your location:</Text>
      <Text>Latitude: {location.latitude}</Text>
      <Text>Longitude: {location.longitude}</Text>
      
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Marking the user's location */}
        <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} title="You are here" />
        
        {/* Marking a nearby restaurant */}
        <Marker coordinate={{ latitude: nearbyRestaurant.latitude, longitude: nearbyRestaurant.longitude }} title={nearbyRestaurant.name} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: 400,
  },
});

