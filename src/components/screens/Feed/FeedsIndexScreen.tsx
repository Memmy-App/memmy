import React, { useEffect, useRef } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Alert } from "react-native";
import { useFeed } from "../../../hooks/feeds/useFeed";
import {
  initialize,
  lemmyInstance,
  resetInstance,
} from "../../../LemmyInstance";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { selectCurrentAccount } from "../../../slices/accounts/accountsSlice";
import { Account } from "../../../types/Account";
import { writeToLog } from "../../../helpers/LogHelper";
import { getUnreadCount } from "../../../slices/site/siteActions";
import FeedHeaderDropdown from "./components/FeedHeaderDropdown";
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
      writeToLog("Error getting feed.");
      writeToLog(e.toString());

      Alert.alert(e.toString());
    }

    previousAccount.current = currentAccount;

    dispatch(getUnreadCount());

    feed.doLoad(true);
    feed.setLoaded(true);
  };

  const headerTitle = () => <FeedHeaderDropdown enabled />;

  return <FeedView feed={feed} />;
}

export default FeedsIndexScreen;
