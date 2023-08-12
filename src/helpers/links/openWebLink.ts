import { Alert, Linking } from "react-native";
import { writeToLog } from "@src/helpers/debug/DebugHelper";
import { useSettingsStore } from "@src/state/settings/settingsStore";
import * as WebBrowser from "expo-web-browser";
import { WebBrowserPresentationStyle } from "expo-web-browser";

export const openWebLink = (link: string, color = "#000"): void => {
  const settings = useSettingsStore.getState();
  const urlPattern =
    /(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])/;

  try {
    writeToLog(`Trying to open link: ${link}`);

    let fixedLink = decodeURIComponent(link);

    const match = fixedLink.match(urlPattern);
    if (!match) return;

    fixedLink = match[0];

    fixedLink = fixedLink.replace("%5D", "");

    // TODO Remove this once Expo publishes new fix. For now this will stop matrix crashes

    const matrixCheck = /#/g;
    const matrixCheckCount = (link.match(matrixCheck) || []).length;

    if (settings.useDefaultBrowser || matrixCheckCount > 1) {
      Linking.openURL(link).then();
      return;
    }

    WebBrowser.openBrowserAsync(fixedLink, {
      dismissButtonStyle: "close",
      readerMode: settings.useReaderMode,
      presentationStyle: WebBrowserPresentationStyle.FULL_SCREEN,
      toolbarColor: color,
    })
      .then(() => {
        WebBrowser.dismissBrowser();
      })
      .catch((e) => {
        writeToLog(e.toString());
      });
  } catch (e: any) {
    writeToLog("Error opening link.");
    writeToLog(e.toString());
    Alert.alert("Error.", e.toString());
  }
};
