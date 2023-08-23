import { FC, useCallback, useLayoutEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import MapView, {
  LatLng,
  MapPressEvent,
  Marker,
  Region,
} from 'react-native-maps';
import { IconButton } from '../components/ui/IconButton';

interface MapProps {
  navigation: any;
  route: any;
}

export const Map: FC<MapProps> = ({ navigation, route }: MapProps) => {
  const initialLocation: LatLng = route.params && {
    latitude: route.params.initialLat,
    longitude: route.params.initialLng,
  };
  const [selectedLocation, setSelectedLocation] =
    useState<LatLng>(initialLocation);

  const region: Region = {
    latitude: initialLocation ? initialLocation.latitude : 37.78,
    longitude: initialLocation ? initialLocation.longitude : -122.43,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  function selectLocationHandler(event: MapPressEvent) {
    if (initialLocation) {
      return;
    }
    const lat = event.nativeEvent.coordinate.latitude;
    const lng = event.nativeEvent.coordinate.longitude;
    setSelectedLocation({ latitude: lat, longitude: lng });
  }

  const savePickedLocationHandler = useCallback(() => {
    if (!selectedLocation) {
      Alert.alert(
        'No location picked!',
        'You have to pick a location (by tapping on the map) first!'
      );
      return;
    }
    navigation.navigate('AddPlaces', {
      pickedLat: selectedLocation.latitude,
      pickedLng: selectedLocation.longitude,
    });
  }, [navigation, selectedLocation, initialLocation]);

  useLayoutEffect(() => {
    if (initialLocation) {
      return;
    }
    navigation.setOptions({
      headerRight: ({ tintColor }: { tintColor: string }) => (
        <IconButton
          color={tintColor}
          icon='save'
          size={24}
          onPress={savePickedLocationHandler}
        />
      ),
    });
  }, [navigation, savePickedLocationHandler]);

  return (
    <MapView
      style={styles.map}
      initialRegion={region}
      onPress={selectLocationHandler}
    >
      {selectedLocation && (
        <Marker
          title='Picked Location'
          coordinate={initialLocation ? initialLocation : selectedLocation}
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
