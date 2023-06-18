import React, { useEffect, useRef } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { current } from "@reduxjs/toolkit";
import { Alert } from "react-native";
import FeedView from "../../ui/Feed/FeedView";
import FeedHeaderDropdown from "../../ui/Feed/FeedHeaderDropdown";
import { useFeed } from "../../hooks/feeds/feedsHooks";
import {
  initialize,
  lemmyAuthToken,
  lemmyInstance,
} from "../../../lemmy/LemmyInstance";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  getAllCommunities,
  getSubscribedCommunities,
} from "../../../slices/communities/communitiesActions";
import CIconButton from "../../ui/CIconButton";
import {
  selectAccounts,
  selectCurrentAccount,
} from "../../../slices/accounts/accountsSlice";
import { loadBookmarks } from "../../../slices/bookmarks/bookmarksActions";
import { Account } from "../../../types/Account";

function FeedsIndexScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const feed = useFeed();

  const currentAccount = useAppSelector(selectCurrentAccount);
  const previousAccount = useRef<Account | null>(null);

  const dispatch = useAppDispatch();

  const headerTitle = () => (
    <FeedHeaderDropdown
      title={`${currentAccount.username}@${currentAccount.instance}`}
      enabled
    />
  );
  const headerLeft = () => (
    <CIconButton
      name="star-outline"
      onPress={() => navigation.navigate("Subscriptions")}
    />
  );

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => headerLeft(),
      headerTitle: () => headerTitle(),
    });

    if (currentAccount === previousAccount.current) return;

    load().then();
  }, [currentAccount]);

  const load = async () => {
    try {
      await initialize({
        username: currentAccount.username,
        password: currentAccount.password,
        auth: currentAccount.token,
        server: currentAccount.instance,
      });

      feed.doLoad(false);
    } catch (e) {
      Alert.alert(e.toString());
    }

    previousAccount.current = currentAccount;

    dispatch(getSubscribedCommunities());
    dispatch(getAllCommunities());
    dispatch(loadBookmarks());

    feed.doLoad(true);
  };

  return <FeedView feed={feed} />;
}

export default FeedsIndexScreen;
