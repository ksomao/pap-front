import React from 'react'
import {
  StyleSheet,
  Text, TouchableOpacity,
  View
} from 'react-native'
import MapViewDirections
  from 'react-native-maps-directions';
import MapView, {
  PROVIDER_GOOGLE,
  Marker
} from 'react-native-maps';
import Permissions
  from "react-native-permissions";
import MyButton from "../components/MyButton";
import Modal from "../components/Modal";
import Geolocation from 'react-native-geolocation-service';


const GOOGLE_MAPS_APIKEY = 'AIzaSyAtpCqy-sckbK1xhx212hMH_vvjaHBMtDg';


class MapScreen extends React.Component {
  state = {
    latitudeUser: 50.8503396,
    longitudeUser: 4.3517103,
    latitudeDestination: 50.8503396,
    longitudeDestination: 4.3517103,
    error: null,
    loading: false
  };

  static navigationOptions = {
    headerTitle: <Text>TITLE</Text>,
  }

  componentDidMount() {
    let {user, destination} = this.props.navigation.state.params
    this.setState({
      latitudeUser: user.latitude,
      longitudeUser: user.longitude,
      latitudeDestination: destination.latitude,
      longitudeDestination: destination.longitude
    })
  }

  geolocateUser() {
    this.setState({loading: true})
    const OPTIONS = {
      timeout: 20000,
      maximumAge: 1000
    }
    Geolocation.getCurrentPosition(
      this.setLongLat.bind(this),
      this.handleGeolocationError.bind(this),
      OPTIONS,
    )
  }

  setLongLat(position) {
    this.setState({
      latitudeUser: position.coords.latitude,
      longitudeUser: position.coords.longitude,
      error: null,
      loading: false
    })
  }

  handleGeolocationError(error) {
    this.setState({
      error: error.message,
      loading: false
    }, () =>
      alert("Nous n'avons pas vous geolocaliser veuillez réessayer manuellement"))
  }


  render() {
    return (
      <View style={styles.container}>
        {this.state.loading && <Modal/>}
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: this.state.latitudeUser,
            longitude: this.state.longitudeUser,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}>
          <MapViewDirections
            mode={'walking'}
            origin={{
              latitude: this.state.latitudeUser,
              longitude: this.state.longitudeUser
            }}
            strokeWidth={3}
            strokeColor="hotpink"
            destination={{
              latitude: this.state.latitudeDestination,
              longitude: this.state.longitudeDestination
            }}
            apikey={GOOGLE_MAPS_APIKEY}
          />
          <Marker
            coordinate={{
              latitude: this.state.latitudeUser,
              longitude: this.state.longitudeUser
            }}
            pinColor={'#108394'}
            title={"Ma Position"}
            description={"Ma Position"}
          />
          <Marker
            coordinate={{
              latitude: this.state.latitudeDestination,
              longitude: this.state.longitudeDestination
            }}
            pinColor={'#108394'}
            title={"destination"}
            description={"destination"}
          />
        </MapView>

        <MyButton
          backgroundColor="white"
          color="white"
          pressed={() => this.geolocateUser()}>
          Recalculer ma position
        </MyButton>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
    paddingBottom: 16
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  }
});

export default MapScreen