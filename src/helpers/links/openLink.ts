import ExpoLinking from 'expo-linking/src/ExpoLinking';

export const openLink = (url: string): void => {
  void ExpoLinking.openURL(url);
};
