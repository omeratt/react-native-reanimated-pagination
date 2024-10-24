import { useCallback, useMemo } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

type Props = {
  data: number[];
  dotWidth: number;
  marginRight: number;
  maxDots: number;
  activeIndex: SharedValue<number>;
  relevantDotsStyle: ViewStyle;
  mode: 'fadeIn' | 'slide' | 'liquid';
  flatListRef: React.RefObject<Animated.FlatList<number>>;
  activeDotSize: number;
  activeDotScale: number;
};

/**
 * A hook that returns the animated style and function for the dot position, flat list position,
 * and the liquid animation.
 *
 * @param {number[]} data The array of data to be rendered.
 * @param {number} dotWidth The width of the dot.
 * @param {number} marginRight The right margin of the dot.
 * @param {number} maxDots The maximum number of dots.
 * @param {"fadeIn" | "slide" | "liquid"} mode The mode of the animation.
 * @param {ViewStyle} relevantDotsStyle The style of the dot.
 * @param {React.RefObject<Animated.FlatList<number>>} flatListRef The ref of the FlatList.
 * @returns An object with the following properties:
 *   - animatedActiveDotPosition: The animated style for the active dot position.
 *   - animatedFlatListPosition: The animated style for the flat list position.
 */
const usePaginationAnimationProps = ({
  activeIndex,
  data,
  dotWidth,
  marginRight,
  maxDots,
  mode,
  flatListRef,
  activeDotSize,
  activeDotScale,
}: Props) => {
  const activeDotInterpolateOutput = useMemo(() => {
    return data.map((_, index) => {
      const nextPos = index * (dotWidth + marginRight);
      const curPos = (maxDots - 2) * (dotWidth + marginRight);
      const lastPos = (maxDots - 1) * (dotWidth + marginRight);
      const needToStay = index >= maxDots - 2;
      const isLast = index === data.length - 1;
      return isLast ? lastPos : needToStay ? curPos : nextPos;
    });
  }, [data, dotWidth, marginRight, maxDots]);

  const liquidDataScaleYOutput = useMemo(() => {
    const scaleData = [];
    const lastIndex = data.length - 1;
    const lastTwoIndex = lastIndex - 1;
    for (let index = 0; index < data.length; index++) {
      if (index === lastIndex) {
        scaleData.push(1);
      } else if (index === lastTwoIndex) {
        scaleData.push(1, 0.3);
      } else {
        scaleData.push(1, 0.3);
      }
    }
    return scaleData;
  }, [data.length]);

  const liquidDataScaleXOutput = useMemo(() => {
    const scaleData = [];
    const lastIndex = data.length - 1;
    const lastTwoIndex = lastIndex - 1;
    for (let index = 0; index < data.length; index++) {
      if (index === lastIndex) {
        scaleData.push(1);
      } else if (index === lastTwoIndex) {
        scaleData.push(1, 1.7);
      } else {
        scaleData.push(1, 1.7);
      }
    }
    return scaleData;
  }, [data.length]);

  const slideDataScaleOutput = useMemo(() => {
    const scaleData = [];
    const lastIndex = data.length - 1;
    const lastTwoIndex = lastIndex - 1;
    for (let index = 0; index < data.length; index++) {
      if (index === lastIndex) {
        scaleData.push(activeDotScale);
      } else if (index === lastTwoIndex) {
        scaleData.push(activeDotScale, 1);
      } else {
        scaleData.push(activeDotScale, 1);
      }
    }
    return scaleData;
  }, [data.length, activeDotScale]);

  const borderRadiusOutput = useMemo(() => {
    const radiusData = [];
    const lastIndex = data.length - 1;
    const lastTwoIndex = lastIndex - 1;
    for (let index = 0; index < data.length; index++) {
      if (index === lastIndex) {
        radiusData.push(activeDotSize / 2);
      } else if (index === lastTwoIndex) {
        radiusData.push(activeDotSize / 2, activeDotSize / 4.5);
      } else {
        radiusData.push(activeDotSize / 2, activeDotSize / 4.5);
      }
    }
    return radiusData as number[];
  }, [data.length, activeDotSize]);

  const liquidDataInput = useMemo(() => {
    const liquidData = [];
    const halfPoint = 0.5;
    const lastIndex = data.length - 1;
    for (let index = 0; index < data.length; index++) {
      if (index === lastIndex) {
        liquidData.push(index);
      } else {
        liquidData.push(index);
        liquidData.push(index + halfPoint);
      }
    }
    return liquidData;
  }, [data.length]);

  const flatListInterpolateOutput = useMemo(() => {
    return data.map((_, index) => {
      const moveIndexFrom = maxDots - 2;
      const stopMoveIndexFrom = maxDots - 1;

      const stopPos = (index - stopMoveIndexFrom) * (dotWidth + marginRight);

      const nextPos = (index - moveIndexFrom) * (dotWidth + marginRight);

      const relativeNextPos = nextPos < 0 ? 0 : nextPos;

      const isLast = index === data.length - 1;
      return isLast ? stopPos : relativeNextPos;
    });
  }, [data, dotWidth, marginRight, maxDots]);

  const animatedActiveDotPosition = useAnimatedStyle(() => {
    if (mode === 'fadeIn') return {};
    const isLiquid = mode === 'liquid';
    const translateX = interpolate(
      activeIndex.value,
      data,
      activeDotInterpolateOutput,
      'clamp'
    );
    const liquidScaleY = interpolate(
      activeIndex.value,
      liquidDataInput,
      liquidDataScaleYOutput,
      'clamp'
    );

    const liquidScaleX = interpolate(
      activeIndex.value,
      liquidDataInput,
      liquidDataScaleXOutput,
      'clamp'
    );

    const slideScale = interpolate(
      activeIndex.value,
      liquidDataInput,
      slideDataScaleOutput,
      'clamp'
    );

    const borderRadius = interpolate(
      activeIndex.value,
      liquidDataInput,
      borderRadiusOutput,
      'clamp'
    );

    return {
      transform: [
        { translateX },
        { scaleY: isLiquid ? liquidScaleY : 1 },
        { scaleX: isLiquid ? liquidScaleX : 1 },
        { scale: !isLiquid ? slideScale : 1 },
      ],

      borderRadius: isLiquid ? borderRadius : activeDotSize / 2,
      width: activeDotSize,
      height: activeDotSize,
    };
  });

  const scrollToOffset = useCallback(
    (offset: number) => {
      flatListRef?.current?.scrollToOffset?.({
        offset: offset,
        animated: false,
      });
    },
    [flatListRef]
  );

  const animatedFlatListPosition = useAnimatedStyle(() => {
    const activeFlatListPosition = interpolate(
      activeIndex.value,
      data,
      flatListInterpolateOutput,
      'clamp'
    );
    runOnJS(scrollToOffset)(activeFlatListPosition);
    return {};
  });
  return {
    animatedActiveDotPosition,
    animatedFlatListPosition,
  };
};

export default usePaginationAnimationProps;
