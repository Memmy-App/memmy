import { useSettingsStore } from "@src/stores/settings/settingsStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const setSetting = async (setting: object) => {
  useSettingsStore.setState((state) => {
    state.settings = {
      ...state.settings,
      ...setting,
    };

    AsyncStorage.setItem("@Settings", JSON.stringify(state.settings));
  });
};

export default setSetting;
