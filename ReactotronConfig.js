import Reactotron from "reactotron-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import reactotronZustand from "reactotron-plugin-zustand";
import { usePostsStore } from "./src/stores/posts/postsStore";
import { useAccountStore } from "./src/stores/account/accountStore";
import { useCommunitiesStore } from "./src/stores/communities/communitiesStore";
import { useFeedsStore } from "./src/stores/feeds/feedsStore";
import { useInboxStore } from "./src/stores/inbox/inboxStore";
import { useSettingsStore } from "./src/stores/settings/settingsStore";
import { useSiteStore } from "./src/stores/site/siteStore";
import { useUpdatesStore } from "./src/stores/updates/updatesStore";

Reactotron.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  .configure() // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .use(
    //add this line 🙌
    reactotronZustand({
      stores: [
        {
          name: "posts",
          zustand: usePostsStore,
        },
        {
          name: "account",
          zustand: useAccountStore,
        },
        {
          name: "communities",
          zustand: useCommunitiesStore,
        },
        {
          name: "feeds",
          zustand: useFeedsStore,
        },
        {
          name: "filters",
          zustand: useFeedsStore,
        },
        {
          name: "inbox",
          zustand: useInboxStore,
        },
        {
          name: "settings",
          zustand: useSettingsStore,
        },
        {
          name: "site",
          zustand: useSiteStore,
        },
        {
          name: "updates",
          zustand: useUpdatesStore,
        },
      ],
    })
  )
  .connect(); // let's connect!
