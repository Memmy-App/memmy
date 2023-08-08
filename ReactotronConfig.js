import Reactotron from "reactotron-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

Reactotron.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  .configure() // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  // .use(
  //   //add this line 🙌
  //   reactotronZustand({
  //     stores: [
  //       {
  //         name: "posts",
  //         zustand: usePostsStore,
  //       },
  //       {
  //         name: "account",
  //         zustand: useAccountStore,
  //       },
  //       {
  //         name: "communities",
  //         zustand: useCommunitiesStore,
  //       },
  //       {
  //         name: "feeds",
  //         zustand: useFeedsStore,
  //       },
  //       {
  //         name: "filters",
  //         zustand: useFeedsStore,
  //       },
  //       {
  //         name: "inbox",
  //         zustand: useInboxStore,
  //       },
  //       {
  //         name: "settings",
  //         zustand: useSettingsStore,
  //       },
  //       {
  //         name: "site",
  //         zustand: useSiteStore,
  //       },
  //       {
  //         name: "updates",
  //         zustand: useUpdatesStore,
  //       },
  //     ],
  //   })
  .connect(); // let's connect!
