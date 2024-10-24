import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { RenderDot } from './RenderDotItem';
import usePaginationData, {
  DOTS_GAP,
  FadeInOrSlideProps,
  LiquidProps,
  PaginationProps,
} from './usePaginationData';

export type PaginationPropsType = Omit<
  Omit<Omit<PaginationProps, 'defaultDotsStyle'>, 'activeDotSize'>,
  'extraWidth'
> &
  (FadeInOrSlideProps | LiquidProps);

const DOT_SIZE = 10;
/**
 * A component that renders a pagination of dots, given the active index of the carousel.
 * The dots are rendered horizontally, and the active dot is animated to slide to its position.
 * There are three modes: "fadeIn", "slide", and "liquid".
 * The "fadeIn" mode simply fades in the dots without any animation.
 * The "slide" mode slides the active dot to its position.
 * The "liquid" mode slides the active dot to its position and animates the width of the dot to be the width of the container.
 * The user can override the style of the dots with the "overrideDotsStyle" prop.
 * The user can also override the number of dots to display with the "dotsNumber" prop.
 * The user can also override the mode of the animation with the "mode" prop.
 * The user can also override the spaces between the dots with the "spaces" prop.
 * The user can also override the RTL mode with the "isRtl" prop.
 */
const Pagination: React.FC<PaginationPropsType> = (_props) => {
  const {
    maxDots = 7,
    activeIndex,
    activeDotColor = '#000',
    inactiveDotColor = '#FFF',
    overrideDotsStyle,
    dotsNumber,
    isRtl = false,
    spaces = DOTS_GAP,
    mode = 'fadeIn',
  } = _props;

  // let activeDotScale;

  const activeDotScale =
    _props?.mode === 'fadeIn' ||
    _props?.mode === 'slide' ||
    _props?.mode === undefined
      ? (_props?.activeDotScale ?? 1)
      : 1;

  const activeDotWidth = (overrideDotsStyle?.width as number) || DOT_SIZE;

  const _dotWidth = Number(overrideDotsStyle?.width || DOT_SIZE);

  const extraWidth = (activeDotWidth - _dotWidth) / 2;

  const {
    keyExtractor,
    renderItem,
    data,
    containerWidth,
    animatedActiveDotPosition,
    flatListRef,
    dotWidth,
    marginRight,
    relevantDotsStyle,
  } = usePaginationData({
    activeIndex,
    overrideDotsStyle,
    defaultDotsStyle: styles.dotsStyle,
    maxDots,
    dotsNumber,
    activeDotColor,
    inactiveDotColor,
    mode,
    isRtl,
    spaces,
    activeDotSize: Number(overrideDotsStyle?.width || DOT_SIZE),
    extraWidth,
    activeDotScale,
  });

  const extraWidthForFadeInAndScale =
    mode === 'fadeIn' ? activeDotWidth * (activeDotScale - 1) : 0;

  return (
    <View
      style={[
        styles.container,
        {
          width: containerWidth + extraWidthForFadeInAndScale * 2,
          height: Number(relevantDotsStyle.height || DOT_SIZE) * activeDotScale,
        },
      ]}
    >
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        // eslint-disable-next-line react-native/no-inline-styles
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: extraWidthForFadeInAndScale * 0.5,
        }}
        scrollEnabled={false}
        horizontal
        showsHorizontalScrollIndicator={false}
        inverted={isRtl}
        getItemLayout={(_data, index) => {
          const isLastItem = index === (_data?.length || 0) - 1;
          const _itemWidth = isLastItem ? dotWidth : dotWidth + marginRight;
          return {
            length: _itemWidth,
            offset: _itemWidth * index,
            index,
          };
        }}
      />
      {(mode === 'liquid' || mode === 'slide') && (
        <RenderDot
          dotStyle={[
            styles.activeDotStyle,
            { backgroundColor: activeDotColor },
            animatedActiveDotPosition,
          ]}
        />
      )}
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  container: {
    height: DOT_SIZE,
    justifyContent: 'center',
  },
  dotsStyle: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    backgroundColor: 'white',
    borderRadius: DOT_SIZE / 2,
    marginRight: DOTS_GAP,
    zIndex: 1,
  },
  activeDotStyle: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    position: 'absolute',
    zIndex: 2,
  },
});
