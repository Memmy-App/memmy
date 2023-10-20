import ExpoLinking from 'expo-linking/src/ExpoLinking';
import { useSettingsStore } from '@src/state';
import { isUrl } from '@helpers/links/isUrl';
import { Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { WebBrowserPresentationStyle } from 'expo-web-browser';
import { writeToLog } from '@src/helpers';

export const openLink = (link: string | undefined, color: string): void => {
  if (link == null || !isUrl(link)) return;

  const { useDefaultBrowser, readerMode } = useSettingsStore.getState();

  if (useDefaultBrowser) {
    void ExpoLinking.openURL(link);
    return;
  }

  void WebBrowser.openBrowserAsync(link, {
    dismissButtonStyle: 'close',
    readerMode,
    presentationStyle: WebBrowserPresentationStyle.FULL_SCREEN,
    toolbarColor: color,
  })
    .then(() => {
      WebBrowser.dismissBrowser();
    })
    .catch((e: any) => {
      writeToLog('Link error:');
      writeToLog(e.toString());

      Alert.alert('Error', e.toString());
    });
};
