import React, { useEffect, useRef } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Alert } from "react-native";
import { useTheme } from "native-base";
import { IconStar } from "tabler-icons-react-native";
import FeedView from "../../ui/Feed/FeedView";
import FeedHeaderDropdown from "../../ui/Feed/FeedHeaderDropdown";
import { useFeed } from "../../hooks/feeds/useFeed";
import {
  initialize,
  lemmyInstance,
  resetInstance,
} from "../../../lemmy/LemmyInstance";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getSubscribedCommunities } from "../../../slices/communities/communitiesActions";
import HeaderIconButton from "../../ui/buttons/HeaderIconButton";
import {
  selectAccounts,
  selectCurrentAccount,
} from "../../../slices/accounts/accountsSlice";
import { loadBookmarks } from "../../../slices/bookmarks/bookmarksActions";
import { Account } from "../../../types/Account";
import { writeToLog } from "../../../helpers/LogHelper";
import { getUnreadCount } from "../../../slices/site/siteActions";

function FeedsIndexScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  // Global State
  const currentAccount = useAppSelector(selectCurrentAccount);
  const accounts = useAppSelector(selectAccounts);

  // Refs
  const previousAccount = useRef<Account | null>(null);

  // Hooks
  const feed = useFeed();
  const theme = useTheme();

  // Other hooks
  const dispatch = useAppDispatch();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => headerLeft(),
      headerTitle: () => headerTitle(),
    });

    if (currentAccount === previousAccount.current) return;

    resetInstance();
    load().then();
  }, [currentAccount]);

  const load = async () => {
    try {
      if (!lemmyInstance) {
        await initialize({
          username: currentAccount.username,
          password: currentAccount.password,
          auth: currentAccount.token,
          server: currentAccount.instance,
        });
      }
    } catch (e) {
      writeToLog("Error getting feed.");
      writeToLog(e.toString());

      Alert.alert(e.toString());
    }

    previousAccount.current = currentAccount;

    dispatch(getSubscribedCommunities());
    dispatch(getUnreadCount());
    dispatch(loadBookmarks());

    feed.doLoad(true);
    feed.setLoaded(true);
  };

  const headerTitle = () => (
    <FeedHeaderDropdown
      title={`${
        currentAccount ? currentAccount.username : accounts[0].username
      }@${currentAccount ? currentAccount.instance : accounts[0].instance}`}
      enabled
    />
  );
  const headerLeft = () => (
    <HeaderIconButton
      onPress={() => navigation.navigate("Subscriptions")}
      icon={<IconStar color={theme.colors.app.accent} />}
    />
  );

  return <FeedView feed={feed} />;
}

export default FeedsIndexScreen;
