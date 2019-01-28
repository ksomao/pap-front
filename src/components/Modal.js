import React, {Component} from 'react'
import {
  Text,
  Dimensions,
  StyleSheet, View
} from 'react-native'

class Modal extends Component {
  render() {
    return (
      <View
        style={[styles.container]}>
        <Text style={styles.text}>recalcul de
          votre position en cours...</Text>
      </View>
    )
  }
}

export default Modal

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    position: 'absolute',
    width,
    display: 'none',
    height,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  }
});

