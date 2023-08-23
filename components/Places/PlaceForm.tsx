import { FC, useCallback, useState } from 'react';
import { Text, ScrollView, View, TextInput, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { ImagePicker } from './ImagePicker';
import { LocationPicker } from './LocationPicker';
import { CustomButton } from '../ui/CustomButton';
import { PlaceLocationItem } from './PlaceItem';
import { PlaceDataType } from '../../App';

export interface SelectedLocationObject extends PlaceLocationItem {
  address?: string;
}

interface PlaceFormProps {
  onCreate: (data: PlaceDataType) => void;
}

export const PlaceForm: FC<PlaceFormProps> = ({ onCreate }) => {
  const [enteredTitle, setEnteredTitle] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocationObject>();

  function changeTitleHandler(enteredText: string) {
    setEnteredTitle(enteredText);
  }
  function onPickImageHandler(imageUrl: string) {
    setSelectedImage(imageUrl);
  }

  const onPickLocationHandler = useCallback((location: PlaceLocationItem) => {
    setSelectedLocation(location);
  }, []);

  function onSubmitHandler() {
    const placeData: PlaceDataType = {
      title: enteredTitle,
      image: selectedImage,
      location: {
        lat: selectedLocation?.latitude,
        lng: selectedLocation?.longtitude,
        address: selectedLocation?.address,
      },
    };
    onCreate(placeData);
  }

  return (
    <ScrollView style={styles.form}>
      <View>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          onChangeText={changeTitleHandler}
          value={enteredTitle}
        />
      </View>
      <ImagePicker onImagePick={onPickImageHandler} />
      <LocationPicker onLocationPick={onPickLocationHandler} />
      <CustomButton onPress={onSubmitHandler}>Save</CustomButton>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 24,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.primary500,
  },
  input: {
    marginVertical: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontSize: 16,
    borderBottomColor: Colors.primary700,
    borderBottomWidth: 2,
    backgroundColor: Colors.primary100,
  },
});
