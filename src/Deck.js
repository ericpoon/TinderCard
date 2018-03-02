import React, { Component } from 'react';
import {
  View,
  Text,
  Animated,
  PanResponder,
  Dimensions
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

class Deck extends Component {
  constructor() {
    super();

    this.position = new Animated.ValueXY();

    // there could be more than 1 pan responders
    this.panResponder = PanResponder.create({
      /** lifecycle method: called whenever a user taps on the screen, determines whether or not the pan responder should handle the gesture */
      onStartShouldSetPanResponder: () => true,
      /** lifecycle method: called when user is dragging the finger around */
      onPanResponderMove: (event, gesture) => {
        // console.log({...gesture}); // reserve a copy
        /* console.log(gesture)
         * React and React Native reuses the same object for performance purpose
         * so here we are logging out the same single gesture object in memory
         * the second time we access it, it doesn't remain the same value
         */

        this.position.setValue({ x: gesture.dx, y: gesture.dy }); // set manually, instead of using any Animated timing function

      },
      /** lifecycle method: called when user removes the finger on screen */
      onPanResponderRelease: () => {
        this.resetPosition();
      },
    });

    /* Note that Gesture System and Animated System are completely decoupled */
  }

  resetPosition() {
    Animated.spring(this.position, {
      toValue: {x: 0, y: 0}
    }).start();
  }

  getCardStyle() {
    const { x } = this.position;
    const { top, left } = this.position.getLayout();
    const rotateDeg = x.interpolate({ // use an Animated Value to interpolate
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      outputRange: ['-30deg', '0deg', '30deg'],
    });

    return {
      top,
      left,
      transform: [{ rotate: rotateDeg }],
    };
  }

  renderCards() {
    return this.props.data.map((item, index) => {
      const card = this.props.renderCard(item);
      if (index === 0) {
        return (
          <Animated.View
            key={item.id}
            style={this.getCardStyle()}
            {...this.panResponder.panHandlers}
          >
            {card}
          </Animated.View>
        );
      } else {
        return (
          <View key={item.id}>
            {card}
          </View>
        );
      }
    });
  }

  render() {
    this.renderCards();
    return (
      <View>
        {this.renderCards()}
      </View>
    );
  }
}

export default Deck;