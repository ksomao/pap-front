import React from 'react'
import {
  Alert, StyleSheet, Text,
  View, Button, TouchableOpacity, NetInfo
} from 'react-native'
import MyButton from '../components/MyButton'
import Permissions from 'react-native-permissions'
import RNAndroidLocationEnabler
  from 'react-native-android-location-enabler';
import Geolocation
  from 'react-native-geolocation-service';
import {getDatetime} from "../utils";
import of from "await-of";


class LoginScreen extends React.Component {
  state = {
    latitude: null,
    loading: false,
    longitude: null,
    error: null,
    destination: null
  };

  static navigationOptions = {
    headerTitle: <Text>TITLE</Text>,
  }

  componentDidMount() {
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000
    })
      .then(res => {
        console.log(res);
        if (res === 'already-enabled')
          this.geolocateUser(true)
        else
          this.requestPermission()
      }).catch(err => {
      console.log(err);
    });
  }

  isConnected() {
    NetInfo.isConnected.fetch().then(isConnected => {
      return !!isConnected;
    })
  }

  async getNearestAdress() {
    const rawResponse = await fetch('https://calm-mesa-26690.herokuapp.com/api/lieu/nearest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Latitude: this.state.latitude,
        Longitude: this.state.longitude
      })
    });
    const [content, err] = await of(rawResponse.json())
    if (err)
      alert('veuillez verifier votre connexion internet')

    else if (content) {
      content[0].Latitude = +content[0].Latitude.replace(",", ".")
      content[0].Longitude = +content[0].Longitude.replace(",", ".")

      this.setState({destination: content[0]}, () => {
        this.setState({loading: false})
      })
    }
  }

  async getNextAddress(statut = 100) {

    console.log("test");
    let [res, err] = await of(fetch('https://calm-mesa-26690.herokuapp.com/api/visite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "Id_User": 58,
        "Id_Lieu": this.state.destination.Id_Lieu,
        "Description": "",
        "Note": "10",
        "DateHeure_Visite": "",
        "Statut": statut
      })
    }));

    if (err)
      alert('veuillez verifier votre connexion internet')

    else if (res) {
      res.json().then(data => {
        if (data) {
          this.getNearestAdress()
        }
      })

    }
  }

  geolocateUser(getNearest = false) {
    const OPTIONS = {
      timeout: 20000,
      maximumAge: 1000
    }
    this.setState({loading: false})
    Geolocation.getCurrentPosition(
      this.setLongLat.bind(this),
      this.handleGeolocationError.bind(this),
      OPTIONS,
    )
  }

  setLongLat(position) {
    let latitude = position.coords.latitude
    let longitude = position.coords.longitude

    console.log(latitude);
    this.setState({
      latitude,
      longitude,
      error: null,
    }, () => {
      this.getNearestAdress()
    })
  }

  handleGeolocationError(error) {
    this.setState({error: error.message}, () => Alert.alert(
      '',
      "Nous n'avons pas pu vous geolocaliser",
      [
        {
          text: 'réessayer',
          onPress: () => this.geolocateUser()
        },
        {
          text: 'Quitter',
        }
      ],
      {cancelable: false}
    ))
  }

  requestPermission() {
    Permissions.request('location').then(response => {
      if (response !== 'authorized')
        alert("Pour utiliser l'application la géolocalisation est nécessaire")
    })
  }

  render() {
    let destination = this.state.destination ? this.state.destination : null

    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => this.geolocateUser(true)}><Text>refresh
          pos</Text></TouchableOpacity>
        {!destination &&
        <Text>Loading Adresse</Text>}
        {destination &&
        <View>
          <Text>{destination.Adresse}, {destination.Numero}, {destination.Code_Postal}</Text>
        </View>}

        <MyButton
          backgroundColor="black"
          color="white"
          pressed={() => this.getNextAddress()}>
          Adresse suivante
        </MyButton>

        <MyButton
          backgroundColor="black"
          color="white"
          pressed={() => this.props.navigation.navigate('Map', {
            user: {
              latitude: this.state.latitude,
              longitude: this.state.longitude
            },
            destination: {
              latitude: destination.Latitude,
              longitude: destination.Longitude
            }
          })}
        >Go to Map</MyButton>
      </View>
    )
  }
}

const
  styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center'
    },
  });

export default LoginScreen