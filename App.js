/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useState, useEffect } from "react";
import { Button, View, Text } from "react-native";
import Geolocation from "react-native-geolocation-service";
import Permissions from "react-native-permissions";
import firebase from "firebase";
import firebaseConfig from "./firebaseConfig";

var contador = 0;

const App = () => {
  const [count, setCount] = useState(0);
  const [latLong, setLatLong] = useState({});
  const [error, setError] = useState(null);

  function pushToFirebase(json) {
    firebase
      .database()
      .ref()
      .child("location/")
      .set(json);
  }

  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    Permissions.request("location").then(response => {
      console.log(response);
    });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "grey" }}>
      {/* <Button
          title="get my loc"
          onPress={() => {
            Geolocation.getCurrentPosition(

              position => {
                const coords = position.coords;
                setLatLong({lat:coords.latitude,long:coords.longitude})
              },
              error => {
                // See error code charts below.
                setError(error.message)
              },
              {enableHighAccuracy: true, timeout: 15000,}
            );
          }}
        /> */}
      <Button
        title="My loc"
        onPress={() => {
          Geolocation.watchPosition(
            position => {
              contador++;
              const coords = position.coords;
              setLatLong({ lat: coords.latitude, long: coords.longitude });
              setCount(contador);
              pushToFirebase({ lat: coords.latitude, long: coords.longitude });
            },
            error => {
              // See error code charts below.

              setError(error.message);
            },
            { enableHighAccuracy: true, interval: 10000, distanceFilter: 0 }
          );
        }}
      />

      <Text style={{ fontSize: 24 }}>lat: {latLong.lat}</Text>
      <Text style={{ fontSize: 24 }}>lat: {latLong.long}</Text>
      <Text style={{ fontSize: 24 }}>count: {count}</Text>
      <Text style={{ fontSize: 24, color: "red" }}>{error}</Text>
    </View>
  );
};

export default App;
