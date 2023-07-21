import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text, VStack } from "native-base";
import React, { useCallback, useEffect, useRef } from "react";
import { useRoute } from "@react-navigation/core";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import LoadingErrorView from "../../common/Loading/LoadingErrorView";
import NotFoundView from "../../common/Loading/NotFoundView";
import FeedView from "./components/FeedView";
import { useFeedStatus } from "../../../stores/feeds/feedsStore";
import {
  useCommunity,
  useCommunityStatus,
} from "../../../stores/communities/communitiesStore";
import loadFeedPosts from "../../../stores/feeds/actions/loadFeedPosts";
import addFeed from "../../../stores/feeds/actions/addFeed";
import loadCommunity from "../../../stores/communities/actions/loadCommunity";
import LoadingView from "../../common/Loading/LoadingView";
import CommunityHeader from "./components/CommunityHeader";
import removeFeed from "../../../stores/feeds/actions/removeFeed";

function FeedsCommunityScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
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
      <Text fontSize={16} fontWeight="semibold">
        {communityName.toString()}
      </Text>
      <Text fontSize={12}>@{getBaseUrl(actorId?.toString())}</Text>
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
      (!community || communityStatus.loading || communityStatus.error)
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
