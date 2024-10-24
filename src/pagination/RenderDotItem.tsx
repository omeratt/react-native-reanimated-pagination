import React from 'react';
import { ListRenderItemInfo, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  AnimatedStyle,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

type RenderDotItemProps = ListRenderItemInfo<number> & {
  listLength: number;
  relevantDotsStyle: ViewStyle;
  maxDots: number;
  activeIndex: SharedValue<number>;
  activeDotColor: string;
  inactiveDotColor: string;
  mode?: 'fadeIn' | 'slide' | 'liquid';
  isRtl: boolean;
  spaces: number;
  activeDotScale: number;
};
/**
 * A component that renders a dot in the pagination, given as a number in an array.
 * It is animated, and it is the user's responsibility to provide the animated value.
 *
 * @param {RenderDotItemProps} props The props for the component.
 * @param {number} props.index The index of the dot.
 * @param {number} props.item The value of the dot.
 * @param {number} props.listLength The length of the array of dots.
 * @param {ViewStyle} props.relevantDotsStyle The style of the dot.
 * @param {number} props.maxDots The maximum number of dots.
 * @param {Animated.SharedValue<number>} props.activeIndex The animated value of the active index.
 * @param {string} props.activeDotColor The color of the active dot.
 * @param {"fadeIn" | "slide" | "liquid"} [props.mode="fadeIn"] The mode of the animation. Defaults to "fadeIn".
 * @param {boolean} [props.isRtl=false] Whether the dot should be positioned from right to left. Defaults to false.
 * @param {number} [props.spaces=0] The space between the dots. Defaults to 0.
 * @returns {React.ReactElement} The rendered dot.
 */
const RenderDotItem = ({
  index,
  listLength,
  relevantDotsStyle,
  maxDots,
  activeIndex,
  activeDotColor,
  inactiveDotColor,
  mode,
  isRtl,
  spaces,
  activeDotScale,
}: RenderDotItemProps) => {
  const isLastItem = index === listLength - 1;

  const GAP = isLastItem ? 0 : spaces;

  const animatedStyle = useAnimatedStyle(() => {
    const lastIndex = listLength - 1;
    const activeI = activeIndex.value + 0.6;

    const isNeedToScaleDownFromRight = index >= maxDots - 1 && index >= activeI;

    const isNeedToScaleDownFromLeft = activeI - (maxDots - 2) >= index;

    const isLastScaleFromLeft =
      activeI >= lastIndex - 1 && index === lastIndex - (maxDots - 2);

    const isLastScaleFromRight =
      activeI >= lastIndex - 1 && index === lastIndex;

    const backgroundColor = interpolateColor(
      activeIndex.value,
      [index - 1, index - 0.3, index, index + 0.3, index + 1],
      [
        inactiveDotColor,
        activeDotColor,
        activeDotColor,
        activeDotColor,
        inactiveDotColor,
      ]
    );

    const scaleXY = interpolate(
      activeIndex.value,
      [index - 1, index, index + 1],
      [1, activeDotScale, 1],
      'clamp'
    );
    const isIndexOverFlow = activeI >= listLength;

    const scale = withTiming(
      isIndexOverFlow
        ? 1
        : isLastScaleFromRight
          ? 1
          : isLastScaleFromLeft
            ? 1
            : isNeedToScaleDownFromLeft || isNeedToScaleDownFromRight
              ? 0.5
              : 1
    );

    return {
      transform:
        maxDots === listLength
          ? []
          : [
              {
                scaleX: mode === 'fadeIn' ? scaleXY : 1,
              },
              {
                scaleY: mode === 'fadeIn' ? scaleXY : 1,
              },
              { scale },
            ],
      backgroundColor: mode === 'fadeIn' ? backgroundColor : inactiveDotColor,
    };
  });

  const originalSize = relevantDotsStyle.height as number;

  return (
    <RenderDot
      dotStyle={[
        {
          borderRadius: originalSize / 2,
        },
        relevantDotsStyle,
        // eslint-disable-next-line react-native/no-inline-styles
        {
          marginLeft: isRtl ? GAP : 0,
          marginRight: isRtl ? 0 : GAP,
        },
        animatedStyle,
      ]}
    />
  );
};

export default RenderDotItem;

type DotProps = {
  dotStyle?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
};

/**
 * Renders a single dot in the pagination component.
 * @param props.dotsStyle Optional style overrides for the dot.
 * @returns A single, animated dot.
 */
export const RenderDot = ({ dotStyle }: DotProps) => {
  return <Animated.View style={dotStyle} />;
};
