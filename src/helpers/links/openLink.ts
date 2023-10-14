import ExpoLinking from 'expo-linking/src/ExpoLinking';

export const openLink = (url: string | undefined): void => {
  if (url == null) return;

  void ExpoLinking.openURL(url);
};
