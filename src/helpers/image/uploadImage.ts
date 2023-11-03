import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { useAccountStore, useSettingsStore } from '@src/state';
import fs from 'react-native-fs';
import axios from 'axios';
import { getAccessToken } from '@helpers/secureStore';

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

export const uploadImage = async (
  uri: string,
  forceImgur = false,
): Promise<string | null> => {
  const useImgur = useSettingsStore.getState().useImgur;

  if (useImgur || forceImgur) {
    return await uploadImageWithImgur(uri);
  }

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
    // Get the access token
    const accessToken = await getAccessToken(currentAccount);

    if (accessToken == null) {
      return null;
    }

    const res = await fs.uploadFiles({
      toUrl: instanceUrl,
      files,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Cookie: 'jwt=' + accessToken,
      },
    }).promise;

    const fileName = JSON.parse(res.body).files[0].file;

    return `https://${currentAccount.instance}/pictrs/image/${fileName}`;
  } catch (e: any) {
    throw new Error();
  }
};

export const uploadImageWithImgur = async (
  uri: string,
): Promise<string | null> => {
  const extension = uri.split('.').pop();

  if (extension == null || imageTypes[extension] == null) {
    Alert.alert('Error', 'Invalid image type.');
    return null;
  }

  try {
    const formData = new FormData();

    formData.append('image', {
      uri,
      name: `image.${extension}`,
      type: imageTypes[extension],
    } as any);

    const res = await axios.post('https://api.imgur.com/3/image', formData, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: 'Client-ID 2969d60a8c6616b',
      },
    });

    return res.data.data.link;
  } catch (e: any) {
    throw new Error();
  }
};
