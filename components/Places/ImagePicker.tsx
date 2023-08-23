import { FC, useState } from 'react';
import { View, Alert, Image, Text, StyleSheet } from 'react-native';
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from 'expo-image-picker';
import { Colors } from '../../constants/colors';
import { OutlinedButton } from '../ui/OutlinedButton';

interface ImagePickerProps {
  onImagePick: (imageUrl: string) => void;
}

export const ImagePicker: FC<ImagePickerProps> = ({ onImagePick }) => {
  const [cameraPermissionInfo, requestPermission] = useCameraPermissions();
  const [previewImageUri, setPreviewImageUri] = useState<string | undefined>();
  async function verifyPermissions() {
    if (cameraPermissionInfo?.status === PermissionStatus.UNDETERMINED) {
      const permissionResponce = await requestPermission();
      return permissionResponce.granted;
    }
    if (cameraPermissionInfo?.status === PermissionStatus.DENIED) {
      Alert.alert(
        'Insufficient Permissions!',
        'You need to grant permissions to use this app!'
      );
      return false;
    }
    return true;
  }

  async function takeImageHandler() {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }

    const image = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });
    if (!image.canceled) {
      setPreviewImageUri(image.assets[0].uri);
      onImagePick(image.assets[0].uri);
    }
  }
  return (
    <View>
      <View style={styles.imagePreview}>
        {previewImageUri?.length ? (
          <Image style={styles.image} source={{ uri: previewImageUri }} />
        ) : (
          <Text>No image taken yet.</Text>
        )}
      </View>
      <OutlinedButton icon='camera' onPress={takeImageHandler}>
        Take Image
      </OutlinedButton>
    </View>
  );
};

const styles = StyleSheet.create({
  imagePreview: {
    width: '100%',
    height: 200,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary100,
    borderRadius: 4,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
});
