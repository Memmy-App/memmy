import Reactotron from "reactotron-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import reactotronZustand from "reactotron-plugin-zustand";
import { useSettingsStore } from "./src/state/settings/settingsStore";
import { usePostStore } from "./src/state/post/postStore";
import { useFeedStore } from "./src/state/feed/feedStore";
import { useCommunityStore } from "./src/state/community/communityStore";
import { useSiteStore } from "./src/state/site/siteStore";
import { useCommentStore } from "./src/state/comment/commentStore";

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
          name: "post",
          zustand: usePostStore,
        },
        {
          name: "feed",
          zustand: useFeedStore,
        },
        {
          name: "community",
          zustand: useCommunityStore,
        },
        {
          name: "site",
          zustand: useSiteStore,
        },
        {
          name: "comments",
          zustand: useCommentStore,
        },
      ],
    }),
  )
  .connect(); // let's connect!
