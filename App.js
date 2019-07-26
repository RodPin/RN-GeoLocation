import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Permissions from 'react-native-permissions';
import firebase from 'firebase';
import firebaseConfig from './firebaseConfig';
import BackgroundTimer from 'react-native-background-timer';

var contador = 0;

const App = () => {
  const [name, setName] = useState(null);
  const [confirmedName, setConfirmedName] = useState(null);
  const [count, setCount] = useState(0);
  const [latLong, setLatLong] = useState({});
  const [error, setError] = useState(null);

  function pushToFirebase(json) {
    firebase
      .database()
      .ref()
      .child('location/')
      .set(json)
      .then(x => alert(x))
      .catch(err => {
        if (err.message == 'PERMISSION_DENIED: Permission denied') {
          setError('Permission denied');
        }
      });
  }

  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    Permissions.request('location').then(response => {
      console.log(response);
    });
    BackgroundTimer.setInterval(() => {
      // this will be executed every 200 ms
      // even when app is the the background
      Geolocation.getCurrentPosition(
        position => {
          contador++;
          const coords = position.coords;
          setLatLong({lat: coords.latitude, long: coords.longitude});
          setCount(contador);
          pushToFirebase({lat: coords.latitude, long: coords.longitude});
        },
        error => {
          // See error code charts below.
          setError(error.message);
        },
        {enableHighAccuracy: true, timeout: 15000}
      );
    }, 30000);
  }, []);
  if (confirmedName) {
    return (
      <View
        style={{
          flex: 1,
          padding: 40,
          backgroundColor: 'grey',
          alignItems: 'center'
        }}
      >
        <Text style={{fontSize: 30, marginBottom: 30}}>Hi {confirmedName}</Text>
        <Text style={{fontSize: 24}}>lat: {latLong.lat}</Text>
        <Text style={{fontSize: 24}}>long: {latLong.long}</Text>
        <Text style={{fontSize: 24}}>i got your location {count} times</Text>
        <Text style={{fontSize: 24, color: 'red'}}>{error}</Text>
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        padding: 30,
        backgroundColor: 'grey',
        alignItems: 'center'
      }}
    >
      <Text style={{fontSize: 30, marginBottom: 150}}> Name plz</Text>
      <TextInput
        value={name}
        onChangeText={text => setName(text)}
        style={{width: 180, backgroundColor: 'white', marginBottom: 40}}
      />
      <Button
        title="Confirm"
        color="green"
        onPress={() => setConfirmedName(name)}
      />
    </View>
  );
};

export default App;
