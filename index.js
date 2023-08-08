if (__DEV__) {
  import("./ReactotronConfig").then(() => console.log("Reactotron Configured"));
}

import { registerRootComponent } from "expo";

import "./src/locale/i18n";
import "./src/helpers/DayJs";

import App from "./App";
import { enableMapSet } from "immer";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
enableMapSet();
registerRootComponent(App);
