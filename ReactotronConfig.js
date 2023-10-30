import Reactotron from "reactotron-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import reactotronZustand from "reactotron-plugin-zustand";
import { useSettingsStore } from "./src/state/settings/settingsStore";
import { useDraftStore } from "./src/state/draft/draftStore";
import { useAppStore } from "./src/state/app/appStore";
import { useDataStore } from "./src/state";

Reactotron.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  .configure({
    name: "Memmy",
  }) // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .use(
    reactotronZustand({
      stores: [
        {
          name: "settings",
          zustand: useSettingsStore,
        },
        {
          name: "drafts",
          zustand: useDraftStore,
        },
        {
          name: "app",
          zustand: useAppStore,
        },
        {
          name: "data",
          zustand: useDataStore,
        },
      ],
    }),
  )
  .connect(); // let's connect!
