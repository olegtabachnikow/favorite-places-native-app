import { FC, useEffect, useState } from 'react';
import { StyleSheet, View, Alert, Image } from 'react-native';
import { OutlinedButton } from '../ui/OutlinedButton';
import { Colors } from '../../constants/colors';
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from 'expo-location';
import { PlaceLocationItem } from './PlaceItem';
import { getAdress, getMapPreview } from '../../utils/location';
import {
  useNavigation,
  useRoute,
  RouteProp,
  useIsFocused,
} from '@react-navigation/native';
import { AppStackParamList } from '../../App';
import { SelectedLocationObject } from './PlaceForm';
type LocationParamsList = RouteProp<AppStackParamList, 'AddPlaces'>;

interface LocationPickerProps {
  onLocationPick: (data: SelectedLocationObject) => void;
}

export const LocationPicker: FC<LocationPickerProps> = ({ onLocationPick }) => {
  const [placeLocation, setPlaceLocation] = useState<PlaceLocationItem>();
  const isFocused = useIsFocused();
  const [locationPermissionInfo, requestPermission] =
    useForegroundPermissions();
  const navigation = useNavigation();
  const route = useRoute<LocationParamsList>();

  useEffect(() => {
    if (isFocused && route.params) {
      const mapPickedLocation = route.params && {
        lat: route.params.pickedLat,
        lng: route.params.pickedLng,
      };
      if (mapPickedLocation) {
        const locationData = {
          latitude: mapPickedLocation.lat,
          longtitude: mapPickedLocation.lng,
        };
        setPlaceLocation(locationData);
        onLocationPick(locationData);
      }
    }
  }, [route, isFocused]);

  useEffect(() => {
    async function handleLocation() {
      if (placeLocation) {
        const address = await getAdress(
          placeLocation.latitude as number,
          placeLocation.longtitude as number
        );
        onLocationPick({ ...placeLocation, address });
      }
    }
    handleLocation();
  }, [placeLocation, onLocationPick]);

  async function verifyPermissions() {
    if (locationPermissionInfo?.status === PermissionStatus.UNDETERMINED) {
      const permissionResponce = await requestPermission();
      return permissionResponce.granted;
    }
    if (locationPermissionInfo?.status === PermissionStatus.DENIED) {
      Alert.alert(
        'Insufficient Permissions!',
        'You need to grant location permissions to use this app!'
      );
      return false;
    }
    return true;
  }

  async function getLocationHandler() {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    const location = await getCurrentPositionAsync();
    setPlaceLocation({
      latitude: location.coords.latitude,
      longtitude: location.coords.longitude,
    });
  }
  function pickOnMapHandler() {
    navigation.navigate('Map' as never);
  }

  return (
    <View>
      <View style={styles.mapPreview}>
        {placeLocation && (
          <Image
            style={styles.mapPreviewImage}
            source={{
              uri: getMapPreview(
                placeLocation.latitude,
                placeLocation.longtitude
              ),
            }}
          />
        )}
      </View>
      <View style={styles.actions}>
        <OutlinedButton icon='location' onPress={getLocationHandler}>
          Locate User
        </OutlinedButton>
        <OutlinedButton icon='map' onPress={pickOnMapHandler}>
          Pick on Map
        </OutlinedButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mapPreview: {
    width: '100%',
    height: 200,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary100,
    borderRadius: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  mapPreviewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
});
