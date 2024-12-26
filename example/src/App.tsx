import { StyleSheet, View } from 'react-native';
import ImageCarousel from './carousel/ImageCarousel';

export default function App() {
  return (
    <View style={styles.container}>
      <ImageCarousel />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
