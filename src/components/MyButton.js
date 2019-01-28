import React, {Component} from 'react'
import {
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet
} from 'react-native'

class MyButton extends Component {
  render() {
    let {pressed, backgroundColor, color, children} = this.props
    return (
      <TouchableOpacity
        style={[styles.container, {backgroundColor}]}
        onPress={() => pressed()}>
        <Text style={color}>
          {children}
        </Text>
      </TouchableOpacity>
    )
  }
}

export default MyButton

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    width: width - 32,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

