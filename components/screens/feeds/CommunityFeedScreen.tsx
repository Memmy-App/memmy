import React, { useEffect } from "react";
import { Text, VStack } from "native-base";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import FeedView from "../../ui/Feed/FeedView";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import { useFeed } from "../../hooks/feeds/feedsHooks";

function FeedsCommunityScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}) {
  const { communityId, communityName, actorId } = route.params;

  const feed = useFeed(Number(communityId));

  const headerTitle = () => (
    <VStack alignItems="center">
      <Text fontSize={16} fontWeight="semibold">
        {communityName.toString()}
      </Text>
      <Text fontSize={12}>@{getBaseUrl(actorId.toString())}</Text>
    </VStack>
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle,
      title: communityName,
    });

    feed.doLoad();
  }, []);

  return <FeedView feed={feed} community />;
}

export default FeedsCommunityScreen;
