import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useRef } from "react";
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

function FeedsIndexScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  // Global State
  const currentAccount = useAppSelector(selectCurrentAccount);

  // Refs
  const previousAccount = useRef<Account | null>(null);

  // Hooks
  const feed = useFeed();

  // Other hooks
  const dispatch = useAppDispatch();

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

  const headerTitle = () => <FeedListingTypeButton feed={feed} />;

  return <FeedView feed={feed} />;
}

export default FeedsIndexScreen;
