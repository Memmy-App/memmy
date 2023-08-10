import React, { useCallback, useEffect, useRef } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useRoute } from "@react-navigation/core";
import { useCurrentAccount } from "@src/state/account/accountStore";
import { useFeedStatus } from "@src/state/feed/feedStore";
import IAccount from "@src/types/IAccount";
import instance from "@src/Instance";
import { addFeed, loadFeedPosts, removeFeed } from "@src/state/feed/actions";
import { Text } from "react-native";
import {FeedView} from "@src/components/screens/Feed/components";

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

function FeedScreen({ navigation }: IProps): React.JSX.Element {
  const { key } = useRoute();

  const currentAccount = useCurrentAccount();
  const status = useFeedStatus(key);

  const previousAccount = useRef<IAccount | null>(null);
  const initialized = useRef(false);

  const doLoad = useCallback(() => {
    if (!instance.initialized) {
      instance
        .initialize({
          host: currentAccount!.host,
          username: currentAccount!.username,
          authToken: currentAccount!.authToken,
          type: "lemmy",
        })
        .then(() => doLoad());
      return;
    }

    loadFeedPosts(key, {
      refresh: true,
    }).then();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerTitle: () => <Text>Test</Text>,
    });

    return () => {
      removeFeed(key);
    };
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

  useEffect(() => {
    if (currentAccount === previousAccount.current) return;

    instance.resetInstance();
    doLoad();
  });

  return <FeedView />;
}

export default FeedScreen;
