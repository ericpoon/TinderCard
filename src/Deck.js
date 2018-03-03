import React, { Component } from 'react';
import {
  View,
  Text,
  Animated,
  PanResponder,
  Dimensions,
  LayoutAnimation,
  UIManager,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width; // fixme: doesn't work for screen rotation
const SWIPE_THRESHOLD = 0.3 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

class Deck extends Component {
  static defaultProps = { // default props if user doesn't provide
    onSwipeLeft: () => {
    },
    onSwipeRight: () => {
    },
  };

  state = { currentCardIndex: 0 };

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

        this.position.setValue({ x: 0 + gesture.dx, y: 0 + gesture.dy }); // set manually, instead of using any Animated timing function

      },
      /** lifecycle method: called when user removes the finger on screen */
      onPanResponderRelease: (event, gesture) => {
        console.log('released');
        if (gesture.dx > SWIPE_THRESHOLD) {
          console.log('swipe right');
          this.swipeOut('right');
        } else if (-gesture.dx > SWIPE_THRESHOLD) {
          console.log('swipe left');
          this.swipeOut('left');
        } else {
          this.resetPosition();
        }
      },
    });

    /* Note that Gesture System and Animated System are completely decoupled */
  }

  componentWillUpdate() {
    // ----- specially for Android
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    // -----
    LayoutAnimation.spring(); /* animates every change in the component */
  }

  resetPosition() {
    Animated.spring(this.position, {
      toValue: { x: 0, y: 0 },
    }).start();
  }

  swipeOut(direction) {
    const sign = direction.toLowerCase() === 'right' ? 1 : -1;

    Animated.timing(this.position, {
      toValue: ({ x: sign * SCREEN_WIDTH * 1.5, y: 0 }),
      duration: SWIPE_OUT_DURATION,
    }).start(() => this.onSwipeOutComplete(direction));

  }

  onSwipeOutComplete(direction) {
    const { onSwipeLeft, onSwipeRight, data } = this.props;
    const item = data[this.state.currentCardIndex];

    direction.toLowerCase() === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
    this.position.setValue({ x: 0, y: 0 });
    this.setState({ currentCardIndex: this.state.currentCardIndex + 1 });
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
    const { currentCardIndex } = this.state;
    const { data } = this.props;
    if (currentCardIndex >= data.length) {
      return this.props.renderNoMoreCards();
    }

    return data.map((item, i) => {
      if (i < currentCardIndex) return null;

      if (i === currentCardIndex) {
        return (
          <Animated.View
            key={item.id}
            style={[styles.cardStyle, this.getCardStyle()]}
            {...this.panResponder.panHandlers}
          >
            {this.props.renderCard(item)}
          </Animated.View>
        );
      }

      return (
        /* this leads to flashing images in the card,
         * because the card stack gets re-rendered after swiping out a card,
         * and the card in <View> will be promoted to <Animated.View> and this causes the re-rendering
         * so we should use <Animated.View> instead of <View> here, even though we're not doing animation
         * <View key={item.id} style={[styles.cardStyle]}>
         *   {this.props.renderCard(item)}
         * </View>
         */

        <Animated.View key={item.id} style={[styles.cardStyle, { top: (i - currentCardIndex) * 8 }]}>
          {this.props.renderCard(item)}
        </Animated.View>

      );
    }).reverse();
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

const styles = {
  cardStyle: {
    position: 'absolute',
    width: '100%',

    /* Do not use left and right here, as it conflicts when performing animation
     * left: 0,
     * right: 0,
     * */
  },
};

export default Deck;
