import { FC } from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { PlaceItemProps, PlaceItem } from './PlaceItem';
import { Colors } from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';

interface PlacesListProps {
  places: PlaceItemProps[];
}

export const PlacesList: FC<PlacesListProps> = ({ places }) => {
  const navigation = useNavigation<any>();

  function selectPlaceHandler(id: string) {
    navigation.navigate('PlaceDetails', { placeId: id });
  }

  if (places && !places.length) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>
          No places added yet - start adding some!
        </Text>
      </View>
    );
  }
  return (
    <FlatList
      style={styles.list}
      data={places}
      renderItem={({ item }) => (
        <PlaceItem
          title={item.title}
          image={item.image}
          location={item.location}
          id={item.id}
          onSelect={selectPlaceHandler}
        />
      )}
      keyExtractor={(item) => item.id as string}
    />
  );
};

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontSize: 16,
    color: Colors.primary200,
  },
  list: {
    margin: 24,
  },
});
