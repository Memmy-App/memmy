import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text, VStack } from "@src/components/gluestack";
import React, { useCallback, useEffect, useRef } from "react";
import { useRoute } from "@react-navigation/core";
import { useFeedStatus } from "@src/state/feed/feedStore";
import { addFeed, loadFeedPosts, removeFeed } from "@src/state/feed/actions";
import { getBaseUrl } from "@src/helpers/links";
import LoadingView from "@src/components/common/Loading/LoadingView";
import { FeedView } from "@src/components/screens/Feed/components";
import {
  useCommunity,
  useCommunityStatus,
} from "@src/state/community/communityStore";
import { loadCommunity } from "@src/state/community/actions";
import NotFoundView from "@src/components/common/Loading/NotFoundView";
import LoadingErrorView from "@src/components/common/Loading/LoadingErrorView";
import CommunityHeader from "@src/components/screens/Feed/components/CommunityHeader";

function FeedsCommunityScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}): React.JSX.Element {
  const { communityFullName, communityName, actorId } = useRoute<any>().params;
  const { key } = useRoute();

  const feedStatus = useFeedStatus(key);

  const community = useCommunity(communityFullName);
  const communityStatus = useCommunityStatus(communityFullName);

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    if (!feedStatus) {
      addFeed(key, communityFullName);
    } else {
      doLoad(true, true);
      initialized.current = true;
    }
  }, [feedStatus]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle,
      title: communityName,
    });

    return () => {
      removeFeed(key);
    };
  }, []);

  const headerTitle = () => (
    <VStack alignItems="center">
      <Text size="md" fontWeight="semibold">
        {communityName.toString()}
      </Text>
      <Text size="sm">@{getBaseUrl(actorId?.toString())}</Text>
    </VStack>
  );

  const header = useCallback(
    () => <CommunityHeader communityFullName={communityFullName} />,
    [community]
  );

  const doLoad = (refresh = false, reloadCommunity = false) => {
    loadFeedPosts(key, {
      refresh,
    }).then();

    if (
      reloadCommunity &&
      (!communityStatus || communityStatus.loading || communityStatus.error)
    ) {
      loadCommunity(communityFullName).then();
    }
  };

  if (!communityStatus || communityStatus.loading || !feedStatus) {
    return <LoadingView />;
  }

  if (communityStatus.notFound) {
    return <NotFoundView />;
  }

  if (communityStatus.error) {
    return <LoadingErrorView onRetryPress={() => doLoad(true)} />;
  }

  return <FeedView header={header} />;
}

export default FeedsCommunityScreen;
