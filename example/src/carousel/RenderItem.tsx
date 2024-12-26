import { Image } from 'expo-image';
import { Dimensions, StyleSheet, View } from 'react-native';
import { CarouselRenderItem } from 'react-native-reanimated-carousel';
const width = Dimensions.get('window').width;
const RenderItem: CarouselRenderItem<number> = ({ item }) => {
  return (
    <View style={renderStyles.item}>
      <View style={renderStyles.imageContainer}>
        <Image style={renderStyles.image} contentFit="cover" source={item} />
      </View>
    </View>
  );
};
export default RenderItem;

const renderStyles = StyleSheet.create({
  item: {
    width,
    height: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    borderRadius: 12,
  },
});
