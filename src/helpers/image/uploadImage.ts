import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { useAccountStore } from '@src/state';
import fs from 'react-native-fs';

const imageTypes: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  heic: 'image/heic',
};

export const selectImage = async (): Promise<string | null> => {
  // Lets get the status of permissions
  const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

  // If we don't have permission alert and return null
  if (status !== 'granted') {
    Alert.alert(
      'Permissions Error',
      'Please allow access to your media library to upload images.',
    );
    return null;
  }

  const res = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: false,
    allowsMultipleSelection: false,
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
  });

  // If cancelled return null
  if (res.canceled) return null;

  // Return the URI of the image
  return res.assets[0].uri;
};

export const uploadImage = async (uri: string): Promise<string | null> => {
  const extension = uri.split('.').pop();

  if (extension == null || imageTypes[extension] == null) {
    Alert.alert('Error', 'Invalid image type.');
    return null;
  }

  const currentAccount = useAccountStore.getState().currentAccount!;
  const instanceUrl = `https://${currentAccount.instance}/pictrs/image`;

  const files = [
    {
      name: 'images[]',
      filename: `image.${extension}`,
      filepath: uri.replace('file://', ''),
      filetype: imageTypes[extension],
    },
  ];

  try {
    const res = await fs.uploadFiles({
      toUrl: instanceUrl,
      files,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Cookie: 'jwt=' + currentAccount.token,
      },
    }).promise;

    const fileName = JSON.parse(res.body).files[0].file;

    const url = `https://${currentAccount.instance}/pictrs/image/${fileName}`;

    return url;
  } catch (e: any) {
    return null;
  }
};
