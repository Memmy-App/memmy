import { registerRootComponent } from "expo";
import "./src/plugins/i18n/i18n";

import App from "./App";
import "./src/plugins/DayJs";
import { enableMapSet } from "immer";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
enableMapSet();
registerRootComponent(App);
