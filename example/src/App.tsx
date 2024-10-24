import { StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { ReanimatedPagination } from 'react-native-reanimated-pagination';

export default function App() {
  const activeIndex = useSharedValue(0);
  return (
    <View style={styles.container}>
      <ReanimatedPagination activeIndex={activeIndex} dotsNumber={5} />
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
