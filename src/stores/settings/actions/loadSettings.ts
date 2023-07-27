import AsyncStorage from "@react-native-async-storage/async-storage";
import { writeToLog } from "@src/helpers/LogHelper";
import { useSettingsStore } from "@src/stores/settings/settingsStore";
import { SettingsState } from "@src/slices/settings/settingsSlice";

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
