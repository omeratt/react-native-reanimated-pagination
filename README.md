# React Native Reanimated Pagination

## Overview

### Welcome to **React Native Reanimated Pagination** - a versatile and customizable pagination solution

designed for seamless navigation through carousels or multi-page content. <br/>
Whether you're working on a small-scale project or a complex application,<br/>
this component brings flexibility, simplicity, and style to your pagination needs.

| FadeIn Mode  | Slide Mode   | Liquid Mode   |
| ------------ | ------------ | ------------- |
| ![FadeIn Demo](./readme_assets/FadeIn.gif) | ![Slide Demo](./readme_assets/slide.gif) | ![Liquid Demo](./readme_assets/liquid.gif) |

## Features

- **Multiple Animation Modes**: Choose between `fadeIn`, `slide`, or `liquid` animation for smooth transitions between active and inactive dots.
- **Fully Customizable Dots**: Modify the size, colors, and spacing of pagination dots to match your design system.
- **RTL Support**: Built-in support for right-to-left (RTL) layouts, ensuring accessibility for global audiences.
- **Responsive and Performant**: Optimized for mobile devices, ensuring smooth performance even with larger datasets.
- **Lightweight**: Small footprint and minimal external dependencies, focused on simplicity and speed.

## Installation

You can easily add the component to your project using either `npm` or `yarn`:

```bash
npm install react-native-reanimated-pagination
```

or

```bash
yarn add react-native-reanimated-pagination
```

## Usage

Here's the main example of how to integrate the `ReanimatedPagination` component into your app using `react-native-reanimated`:

### Main Example

```tsx
import { Dimensions, View, FlatList } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import ImagesBackground from './ImagesBackground';
import RenderItem from './RenderItem';

import { ReanimatedPagination } from 'react-native-reanimated-pagination';

const width = Dimensions.get('window').width;
const ITEM_WIDTH = width;

const ImageCarousel = (props) => {
  const sharedIndex = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      // Calculate index based on x offset
      sharedIndex.value = event.contentOffset.x / ITEM_WIDTH;
    },
  });

  return (
    <View style={styles.container}>
      <ImagesBackground activeIndex={sharedIndex} />

      <View style={styles.carouselStyle}>
        <Animated.FlatList
          onScroll={onScroll}
          horizontal
          data={images}
          renderItem={({ item, index }) => (
            //@ts-ignore
            <RenderItem item={item} index={index} />
          )}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <ReanimatedPagination
        activeIndex={sharedIndex}
        dotsNumber={images.length}
        activeDotColor="pink"
        inactiveDotColor="gray"
        maxDots={5}
        spaces={14}
        mode="fadeIn"
        activeDotScale={1}
        overrideDotsStyle={{ width: 14, height: 14 }}
      />
    </View>
  );
};
```

## Props

The `ReanimatedPagination` component accepts the following props:

| Prop                | Type                                         | Default  | Description                                                              |
| ------------------- | -------------------------------------------- | -------- | ------------------------------------------------------------------------ |
| `activeIndex`       | SharedValue<number> (required)               | -        | The index of the currently active dot.                                   |
| `dotsNumber`        | number (required)                            | 7        | Total number of dots to display.                                         |
| `mode`              | `'fadeIn'`, `'slide'`, `'liquid'` (optional) | 'fadeIn' | Animation mode for the dots. Options: `'fadeIn'`, `'slide'`, `'liquid'`. |
| `activeDotColor`    | string (optional)                            | '#000'   | Color of the active dot.                                                 |
| `inactiveDotColor`  | string (optional)                            | '#FFF'   | Color of the inactive dots.                                              |
| `overrideDotsStyle` | object (optional)                            | {}       | Custom styles for the dots (e.g., size, shape).                          |
| `spaces`            | number (optional)                            | 8 | Space between the dots.                                                  |
| `isRtl`             | boolean (optional)                           | false    | Set `true` to enable right-to-left (RTL) layout.                         |

## RTL Support – A Special Feature for Israeli Developers 🇮🇱

For all my Israeli friends and developers working with RTL layouts, I’ve included **native RTL support** in the pagination component. Whether you're building apps in Hebrew, Arabic, or any other RTL language, the pagination component will automatically adjust to display in the correct order with the `isRtl` prop.

```tsx
import React from 'react';
import { Pagination } from 'react-native-reanimated-pagination';

const App = () => {
  return (
    <Pagination
      activeIndex={2}
      dotsNumber={5}
      mode="slide"
      activeDotColor="#FF0000"
      inactiveDotColor="#CCCCCC"
      isRtl={true} // Enable RTL mode for right-to-left layouts
    />
  );
};

export default App;
```

> **Why RTL?**  
> In many apps targeting Israeli or Arabic-speaking audiences, RTL (Right-to-Left) layouts are essential. This feature ensures that the pagination aligns perfectly with the flow of RTL text and navigation, giving your users a native and seamless experience.

## Animation Modes

The component supports three types of animations for transitioning between dots:

1. **`fadeIn`**: The active dot fades in and out without any movement.
2. **`slide`**: The active dot smoothly slides to the next position.
3. **`liquid`**: The active dot not only slides but also expands and contracts, giving it a liquid-like feel.

### Mode Example

```tsx
<Pagination
  activeIndex={3}
  dotsNumber={7}
  mode="liquid" // Try 'fadeIn', 'slide', or 'liquid'
/>
```

## Customization

You can fully customize the appearance of the dots by passing the `overrideDotsStyle` prop. Change their size, shape, or even add a border to make them fit your design system.

```tsx
<Pagination
  activeIndex={1}
  dotsNumber={4}
  overrideDotsStyle={{
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3498db',
  }}
/>
```

### Spacing Between Dots

Adjust the spacing between the dots with the `spaces` prop:

```tsx
<Pagination
  activeIndex={1}
  dotsNumber={6}
  spaces={8} // Example: Set custom space between dots
/>
```

## Contributing

If you want to contribute to this library, feel free to submit a pull request or open an issue for any suggestions. Here's how you can get involved:

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add a feature'`).
4. Push the branch (`git push origin feature/your-feature`).
5. Open a pull request.

All contributions are welcome!

## License

This project is licensed under the MIT License © 2024 omeratt.

---
