import React from 'react';
import { images } from '../../assets/images/carousel';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
  FadeIn,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

type Props = {
  activeIndex: SharedValue<number>;
};
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ImagesBackground = (props: Props) => {
  return (
    <Animated.View entering={FadeIn} style={styles.fullWidth}>
      {images.map((image, index) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const animatedOpacity = useAnimatedStyle(() => {
          //interpolate opacity between 0 and 1 based on active index
          const opacity = interpolate(
            props.activeIndex.value,
            [index - 1, index, index + 1],
            [0, 1, 0]
          );

          return {
            opacity,
          };
        });

        return (
          <Animated.Image
            key={index}
            style={[styles.absoluteFill, animatedOpacity]}
            source={image}
            blurRadius={30}
            resizeMode={'cover'}
          />
        );
      })}
    </Animated.View>
  );
};

export default ImagesBackground;

const styles = StyleSheet.create({
  absoluteFill: {
    position: 'absolute',
    width,
    height,
  },
  fullWidth: {
    ...StyleSheet.absoluteFillObject,
  },
});
