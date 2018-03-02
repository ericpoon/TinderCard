import React, { Component } from 'react';
import { View, Animated, Text } from 'react-native';

class Ball extends Component {

  componentWillMount() {
    this.position = new Animated.ValueXY(0, 0); // initial position
    Animated.spring(this.position, {
      toValue: { x: 200, y: 500 }, // final position
    }).start();
  }

  render() {
    return (
      /* this is the actual element to be animated,
       * receives info about animation and plays it on screen */
      <Animated.View style={this.position.getLayout()}>
        <View style={styles.ball} />
      </Animated.View>
    );
  }
}

const styles = {
  ball: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 30,
    borderColor: 'black',
  },
};

export default Ball;