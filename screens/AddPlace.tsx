import { FC } from 'react';
import { PlaceForm } from '../components/Places/PlaceForm';
import { NavigationProp } from '@react-navigation/native';
import { AppStackParamList } from '../App';
import { PlaceDataType } from '../App';
import { insertPlace } from '../utils/database';

type AddPlacesParamsList = NavigationProp<AppStackParamList, 'AddPlaces'>;

interface AddPlaceProps {
  navigation: AddPlacesParamsList;
}

export const AddPlace: FC<AddPlaceProps> = ({ navigation }) => {
  function createPlaceHandler(data: PlaceDataType) {
    insertPlace(data);
    navigation.navigate('AllPlaces');
  }
  return <PlaceForm onCreate={createPlaceHandler} />;
};
