import AsyncStorage from "@react-native-async-storage/async-storage";
import { writeToLog } from "@src/helpers/LogHelper";
import {
  SettingsState,
  useSettingsStore,
} from "@src/stores/settings/settingsStore";

const loadSettings = async () => {
  try {
    const settingsStr = await AsyncStorage.getItem("@Settings");

    if (!settingsStr) return;

    useSettingsStore.setState((state) => {
      state.settings = {
        ...state.settings,
        ...(JSON.parse(settingsStr) as SettingsState),
      };
    });
  } catch (e) {
    writeToLog("Error getting Settings.");
    writeToLog(e.toString());
  }
};

export default loadSettings;
