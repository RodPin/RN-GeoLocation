/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, View, Text} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Permissions from 'react-native-permissions';
class App extends Component {
  constructor() {
    super();
    this.state = {
      lat: null,
      long: null
    };
  }
  componentDidMount() {
    Permissions.request('location').then(response => {
      // Returns once the user has chosen to 'allow' or to 'not allow' access
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      this.setState({hasLocationPermission: response});
    });

    // Instead of navigator.geolocation, just use Geolocation.
  }

  render() {
    const {lat, long} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: 'grey'}}>
        <Button
          title="get my loc"
          onPress={() => {
            Geolocation.getCurrentPosition(
              position => {
                const coords = position.coords;
                this.setState({
                  lat: coords.latitude,
                  long: coords.longitude
                });
              },
              error => {
                // See error code charts below.
                console.log(error.code, error.message);
              },
              {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
            );
          }}
        />
        <Text style={{fontSize: 24}}>lat: {lat}</Text>
        <Text style={{fontSize: 24}}>lat: {long}</Text>
      </View>
    );
  }
}

export default App;
