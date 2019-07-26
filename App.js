import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  Button,
  ActivityIndicator
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Permissions from 'react-native-permissions';
import firebase from 'firebase';
import firebaseConfig from './firebaseConfig';
import BackgroundTimer from 'react-native-background-timer';
import {ListItem, List, Left, Body, Right} from 'native-base';
var contador = 0;

const App = () => {
  const [name, setName] = useState(null);
  const [confirmedName, setConfirmedName] = useState(null);
  const [count, setCount] = useState(0);
  const [latLong, setLatLong] = useState({});
  const [error, setError] = useState(null);
  const [obj, setObj] = useState(null);
  const [loading, setLoading] = useState(false);

  function pushToFirebase(json) {
    const now = new Date();
    const hour = now.getHours() + ':' + now.getMinutes();
    const date = now.getDay() + '/' + now.getMonth() + '/' + now.getFullYear();
    json = {...json, hour, date};
    firebase
      .database()
      .ref()
      .child('locations/' + confirmedName)
      .set(json)
      .then(x => {})
      .catch(err => {
        if (err.message == 'PERMISSION_DENIED: Permission denied') {
          setError('Saving at database denied');
        }
      });
  }
  function loadFromFirebase() {
    firebase
      .database()
      .ref('locations')
      .on('value', snap => {
        var list = [];
        snap.forEach(data => {
          list.push({
            key: data.key,
            data: data.val()
          });
        });
        setObj(list);
        setLoading(false);
      });
  }
  function renderCards() {
    var aux = [];
    if (loading) {
      return <ActivityIndicator color="white" size="large" />;
    }
    if (obj) {
      obj.map(person => {
        aux.push(
          <Card
            name={person.key}
            lat={person.data.lat}
            long={person.data.long}
            date={person.data.date}
            hour={person.data.hour}
          />
        );
      });
      return aux;
    }
  }
  function getLocation() {
    Geolocation.getCurrentPosition(
      position => {
        contador++;
        const coords = position.coords;
        const json = {lat: coords.latitude, long: coords.longitude};
        setLatLong(json);
        setCount(contador);
        pushToFirebase(json);
      },
      error => {
        // See error code charts below.
        setError(error.message);
      },
      {enableHighAccuracy: true, timeout: 15000}
    );
  }
  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    setLoading(true);

    setTimeout(() => loadFromFirebase(), 1000);
    Permissions.request('location').then(response => {
      console.log(response);
    });
    getLocation();
    BackgroundTimer.setInterval(() => {
      // this will be executed every 200 ms
      // even when app is the the background
      if (confirmedName) {
        getLocation();
      }
    }, 1800000);
  }, []);
  if (confirmedName) {
    return (
      <ScrollView
        style={{
          flex: 1,
          padding: 40,
          backgroundColor: 'grey'
        }}
      >
        <Text style={{fontSize: 30, marginBottom: 30}}>Hi {confirmedName}</Text>
        <Text style={{fontSize: 24}}>lat: {latLong.lat}</Text>
        <Text style={{fontSize: 24}}>long: {latLong.long}</Text>
        <Text style={{fontSize: 24}}>i got your location {count} times</Text>
        <Text style={{fontSize: 24, color: 'red'}}>{error}</Text>
        <List>{renderCards()}</List>
      </ScrollView>
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

const Card = ({name, lat, long, date, hour}) => (
  <ListItem>
    <Left style={{flex: 0.3}}>
      <Text style={{fontSize: 24, color: 'white'}}>{name}</Text>
    </Left>
    <Body style={{flex: 0.4}}>
      <Text style={{fontSize: 18, color: 'white'}}>{lat}</Text>
      <Text style={{fontSize: 18, color: 'white'}}>{long}</Text>
    </Body>
    <Right style={{flex: 0.3, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontSize: 11, color: 'white'}}>{date}</Text>
      <Text style={{fontSize: 14, color: 'white'}}>{hour}</Text>
    </Right>
  </ListItem>
);
