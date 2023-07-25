import { useRoute } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useRef } from "react";
import { useAppDispatch } from "../../../../store";
import {
  initialize,
  lemmyInstance,
  resetInstance,
} from "../../../LemmyInstance";
import { handleLemmyError } from "../../../helpers/LemmyErrorHelper";
import { getUnreadCount } from "../../../slices/site/siteActions";
import { useCurrentAccount } from "../../../stores/account/accountStore";
import addFeed from "../../../stores/feeds/actions/addFeed";
import loadFeedPosts from "../../../stores/feeds/actions/loadFeedPosts";
import removeFeed from "../../../stores/feeds/actions/removeFeed";
import { useFeedStatus } from "../../../stores/feeds/feedsStore";
import { Account } from "../../../types/Account";
import { FeedListingTypeButton } from "./components/FeedListingTypeButton";
import FeedView from "./components/FeedView";

function FeedsIndexScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const { key } = useRoute();
  // Global State
  const currentAccount = useCurrentAccount();
  const status = useFeedStatus(key);

  // Refs
  const previousAccount = useRef<Account | null>(null);
  const initialized = useRef(false);

  const dispatch = useAppDispatch();

  const doLoad = () => {
    if (!lemmyInstance) {
      init().then(() => doLoad);
      return;
    }

    loadFeedPosts(key, {
      refresh: true,
    }).then();
  };

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
    init().then();
  }, [currentAccount]);

  const init = async () => {
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
  };

  const headerTitle = () => <FeedListingTypeButton />;

  return <FeedView />;
}

export default FeedsIndexScreen;
