import React, { Component } from 'react';
import {
  View,
  Text,
  Animated,
  PanResponder,
} from 'react-native';

class Deck extends Component {
  constructor() {
    super();

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
      },
      /** lifecycle method: called when user removes the finger on screen */
      onPanResponderRelease: () => {
      },
    });
  }

  renderCards() {
    return this.props.data.map(item => {
      return this.props.renderCard(item);
    });
  }

  render() {
    this.renderCards();
    console.log(this.panResponder.panHandlers);
    return (
      <View {...this.panResponder.panHandlers}>
        {this.renderCards()}
      </View>
    );
  }
}

export default Deck;