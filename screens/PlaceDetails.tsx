import { FC, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { OutlinedButton } from '../components/ui/OutlinedButton';
import { Colors } from '../constants/colors';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { AppStackParamList } from '../App';
import { fetchPlaceDetails } from '../utils/database';

type PlaceDetailsParamsList = RouteProp<AppStackParamList, 'PlaceDetails'>;
type PlaceDetailsNavigationList = NavigationProp<
  AppStackParamList,
  'PlaceDetails'
>;

interface AddPlaceProps {
  route: PlaceDetailsParamsList;
  navigation: PlaceDetailsNavigationList;
}

export const PlaceDetails: FC<AddPlaceProps> = ({ route, navigation }) => {
  const [fetchedPlace, setFetchedPlace] = useState<any>();
  const selectedPlaceId = route.params?.placeId;
  function showMapHandler() {
    navigation.navigate('Map', {
      initialLat: fetchedPlace.lat,
      initialLng: fetchedPlace.lng,
    });
  }

  useEffect(() => {
    async function fetchPlace(id: string) {
      const response: any = await fetchPlaceDetails(id);
      setFetchedPlace(response);
      navigation.setOptions({
        title: response.title as string,
      });
    }
    fetchPlace(selectedPlaceId);
  }, [selectedPlaceId]);

  if (!fetchedPlace) {
    return (
      <View style={styles.fallback}>
        <Text>Loading place Data...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Image source={{ uri: fetchedPlace.imageUri }} style={styles.image} />
      <View style={styles.locationContainer}>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>Address</Text>
        </View>
        <OutlinedButton icon='map' onPress={showMapHandler}>
          View on Map
        </OutlinedButton>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: '35%',
    minHeight: 300,
    width: '100%',
  },
  locationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressContainer: {
    padding: 20,
  },
  address: {
    color: Colors.primary500,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
