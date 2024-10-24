import React, { useCallback, useMemo, useRef } from 'react';
import { ListRenderItem, ViewStyle } from 'react-native';
import Animated, { SharedValue } from 'react-native-reanimated';
import RenderDotItem from './RenderDotItem';
import usePaginationAnimationProps from './hooks/usePaginationAnimationProps';

export type FadeInOrSlideProps = {
  mode?: 'fadeIn' | 'slide';
  activeDotScale?: number;
  /**
   * The scale of the active dot.
   */
};

export type LiquidProps = {
  mode: 'liquid';
  // No activeDotScale in this mode
};
export type PaginationProps = {
  /**
   * The active index of the pagination dots.
   * @type SharedValue<number>
   */
  activeIndex: SharedValue<number>;

  /**
   * An optional style to override the default dots style.
   * @default undefined
   */
  overrideDotsStyle?: ViewStyle;

  /**
   * The default style for the dots.
   */
  defaultDotsStyle: ViewStyle;

  /**
   * The maximum number of dots to display.
   * @default 7
   */
  maxDots?: number;

  /**
   * The number of dots to display.
   * @default data.length
   */
  dotsNumber: number;

  /**
   * The color of the active dot.
   * @default "#000"
   */
  activeDotColor?: string;

  /**
   * The color of the inactive dot.
   * @default "#FFF"
   */
  inactiveDotColor?: string;

  /**
   * Whether the pagination should be rendered in RTL mode.
   * @default false
   */
  isRtl?: boolean;

  /**
   * The space between the dots.
   * @default 8
   */
  spaces?: number;

  /**
   * The size of the active dot.
   * @default 10
   */
  activeDotSize?: number;

  /**
   * The extra width to be added to the active dot.
   */
  extraWidth: number;
} & (FadeInOrSlideProps | LiquidProps);

export const DOTS_GAP = 8;

/**
 * @param activeIndex The active index of the pagination dots.
 * @param overrideDotsStyle An optional style to override the default dots style.
 * @param defaultDotsStyle The default style for the dots.
 * @param dotsNumber The number of dots to display.
 * @param maxDots The maximum number of dots to display.
 * @param activeDotColor The color of the active dot.
 * @param inactiveDotColor The color of the inactive dot.
 * @param mode The mode of the pagination. Can be "fadeIn", "slide", or "liquid".
 * @param isRtl Whether the pagination should be rendered in RTL mode.
 * @param spaces The spacing between the dots.
 * @param activeDotSize The size of the active dot.
 * @returns An object with the following props:
 * - data: An array of numbers representing the dots.
 * - renderItem: A function to render each dot.
 * - flatListRef: A ref to the FlatList component.
 * - keyExtractor: A function to extract the key for each dot.
 * - containerWidth: The width of the container.
 * - totalWidth: The total width of the dots.
 * - dotWidth: The width of each dot.
 * - marginRight: The margin right between the dots.
 * - animatedActiveDotPosition: The animated position of the active dot.
 * - animatedFlatListPosition: The animated position of the FlatList.
 * - relevantDotsStyle: The style of the dots.
 */
const usePaginationData = (props: PaginationProps) => {
  const activeDotScale =
    props?.mode === 'fadeIn' || props?.mode === 'slide'
      ? (props.activeDotScale ?? 1)
      : 1;

  const {
    activeIndex,
    overrideDotsStyle,
    defaultDotsStyle,
    dotsNumber,
    maxDots = 7,
    activeDotColor = '#000',
    inactiveDotColor = '#FFF',
    mode = 'fadeIn',
    isRtl = false,
    spaces = DOTS_GAP,
    activeDotSize = 10,
  } = props;

  const flatListRef = useRef<Animated.FlatList<number>>(null);

  const relevantDotsStyle = useMemo(
    () => (overrideDotsStyle ? overrideDotsStyle : defaultDotsStyle),
    [overrideDotsStyle, defaultDotsStyle]
  );

  const marginRight = spaces;

  const data = useMemo(() => {
    return [...new Array(dotsNumber).keys()];
  }, [dotsNumber]);

  const dotWidth = useMemo(
    () =>
      isNaN(Number(relevantDotsStyle.width))
        ? 0
        : (relevantDotsStyle.width as number),
    [relevantDotsStyle.width]
  );

  const containerWidth = useMemo(() => {
    return (
      dotWidth * (maxDots - 1) + (maxDots - 1) * marginRight + activeDotSize
    );
  }, [maxDots, marginRight, dotWidth, activeDotSize]);

  const totalWidth = useMemo(() => {
    return (data.length - 1) * dotWidth + (data.length - 1) * marginRight;
  }, [data, marginRight, dotWidth]);

  const { animatedActiveDotPosition, animatedFlatListPosition } =
    usePaginationAnimationProps({
      activeIndex,
      data,
      dotWidth: dotWidth,
      marginRight,
      maxDots,
      mode,
      relevantDotsStyle,
      flatListRef,
      activeDotSize,
      activeDotScale,
    });

  const keyExtractor = useCallback(
    (item: any, index: number) => index.toString(),
    []
  );

  const renderItem: ListRenderItem<number> = useCallback(
    ({ index, item, separators }) => {
      return (
        <RenderDotItem
          index={index}
          item={item}
          listLength={data.length}
          relevantDotsStyle={relevantDotsStyle}
          separators={separators}
          activeIndex={activeIndex}
          maxDots={maxDots}
          activeDotColor={activeDotColor}
          inactiveDotColor={inactiveDotColor}
          mode={mode}
          isRtl={isRtl}
          spaces={marginRight}
          activeDotScale={activeDotScale}
        />
      );
    },
    [
      data.length,
      relevantDotsStyle,
      activeIndex,
      maxDots,
      activeDotColor,
      inactiveDotColor,
      mode,
      isRtl,
      marginRight,
      activeDotScale,
    ]
  );

  return {
    data,
    renderItem,
    flatListRef,
    keyExtractor,
    containerWidth,
    totalWidth,
    dotWidth,
    marginRight,
    animatedActiveDotPosition,
    animatedFlatListPosition,
    relevantDotsStyle,
  };
};

export default usePaginationData;
