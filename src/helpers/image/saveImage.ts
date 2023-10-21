import { Asset } from 'expo-asset';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
import { writeToLog } from '@src/helpers';
import { setToast } from '@src/state';

export const saveImage = async (source: string): Promise<void> => {
  const uri = Asset.fromURI(source).localUri;

  const cacheDirectory = FileSystem.cacheDirectory;
  console.log(cacheDirectory);

  const res = await FileSystem.readDirectoryAsync(
    `${cacheDirectory}/com.hackemist.SDImageCache/default`,
  );

  console.log(res);

  return;

  const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

  if (status !== 'granted') {
    Alert.alert(
      'Permissions Error',
      'Please allow Memmy access to your camera roll to save images.',
    );

    return;
  }

  try {
    console.log(uri);

    await MediaLibrary.createAssetAsync(uri);

    setToast({
      text: 'Image saved successfully!',
    });
  } catch (e: any) {
    writeToLog(e.toString());

    setToast({
      text: 'Error saving image...',
    });
  }
};
