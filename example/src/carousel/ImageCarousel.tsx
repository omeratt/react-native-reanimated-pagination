import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import ReanimatedPagination from 'react-native-reanimated-pagination';
import { images } from '../../assets/images/carousel';
import ImagesBackground from './ImagesBackground';
import RenderItem from './RenderItem';
import { useCallback } from 'react';
import Carousel from 'react-native-reanimated-carousel';

type Props = {};

const width = Dimensions.get('window').width;

const ImageCarousel = (props: Props) => {
  const sharedIndex = useSharedValue(0);

  const onProgressChange = useCallback(
    (offsetProgress: number, absoluteProgress: number) => {
      sharedIndex.value = absoluteProgress;
    },
    [sharedIndex]
  );

  return (
    <View style={styles.container}>
      <ImagesBackground activeIndex={sharedIndex} />

      <View style={styles.carouselStyle}>
        <Carousel
          width={width}
          height={width}
          style={styles.carouselStyle}
          data={images}
          onProgressChange={onProgressChange}
          renderItem={RenderItem}
        />
      </View>

      <ReanimatedPagination
        activeIndex={sharedIndex}
        dotsNumber={images.length}
        activeDotColor="pink"
        inactiveDotColor="gray"
        maxDots={5}
        spaces={14}
        activeDotScale={1.1}
        overrideDotsStyle={{ width: 14, height: 14 }}
      />
    </View>
  );
};

export default ImageCarousel;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  carouselStyle: {
    marginBottom: 24,
    width,
    height: width,
  },
});
