import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useRef } from "react";
import { useRoute } from "@react-navigation/core";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
  initialize,
  lemmyInstance,
  resetInstance,
} from "../../../LemmyInstance";
import { handleLemmyError } from "../../../helpers/LemmyErrorHelper";
import { useFeed } from "../../../hooks/feeds/useFeed";
import { selectCurrentAccount } from "../../../slices/accounts/accountsSlice";
import { getUnreadCount } from "../../../slices/site/siteActions";
import { Account } from "../../../types/Account";
import { FeedListingTypeButton } from "./components/FeedListingTypeButton";
import FeedView from "./components/FeedView";
import loadFeedPosts from "../../../stores/feeds/actions/loadFeedPosts";
import removeFeed from "../../../stores/feeds/actions/removeFeed";
import {
  useFeedPosts,
  useFeedState,
  useFeedStatus,
} from "../../../stores/feeds/feedsStore";
import addFeed from "../../../stores/feeds/actions/addFeed";
import feedSlice from "../../../slices/feed/feedSlice";

function FeedsIndexScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const { key } = useRoute();
  // Global State
  const currentAccount = useAppSelector(selectCurrentAccount);
  const status = useFeedStatus(key);

  // Refs
  const previousAccount = useRef<Account | null>(null);
  const initialized = useRef(false);

  // Hooks
  const feed = useFeed();

  // Other hooks
  const dispatch = useAppDispatch();

  const doLoad = useCallback(() => {
    loadFeedPosts(key, {
      refresh: false,
      sort: "TopDay",
      type: "All",
    }).then();
    initialized.current = true;
  }, []);

  useEffect(() => {
    if (initialized.current) return;

    if (!status) {
      addFeed(key);
    } else {
      doLoad();
      initialized.current = true;
    }
  }, [status]);

  useEffect(
    () => () => {
      removeFeed(key);
    },
    []
  );

  useEffect(() => {
    navigation.setOptions({
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
      handleLemmyError(e.toString());
    }

    previousAccount.current = currentAccount;

    dispatch(getUnreadCount());

    feed.doLoad(true);
    feed.setLoaded(true);
  };

  const headerTitle = () => <FeedListingTypeButton />;

  return <FeedView />;
}

export default FeedsIndexScreen;
