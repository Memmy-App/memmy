import React from "react";
import { useSettingsStore } from "@src/state/settings/settingsStore";
import { useRoute } from "@react-navigation/core";
import {
  useFeedCommunityName,
  useFeedPost,
  useFeedPosts,
  useFeedStatus,
} from "@src/state/feed/feedStore";

interface IProps {
  header?: () => React.JSX.Element;
}

function FeedView({ header }: IProps): React.JSX.Element {
  const { key } = useRoute();

  const {
    hideReadPostsOnFeed,
    showHideReadButton,
    markReadOnFeedScroll,
    markReadOnCommunityScroll,
    compactView,
  } = useSettingsStore((state) => ({
    hideReadPostsOnFeed: state.hideReadPostsOnFeed,
    showHideReadButton: state.showHideReadButton,
    markReadOnFeedScroll: state.markReadOnFeedScroll,
    markReadOnCommunityScroll: state.markReadOnCommunityScroll,
    compactView: state.compactView,
  }));

  const posts = useFeedPosts(key);
  const status = useFeedStatus(key);

  const communityName = useFeedCommunityName(key);
  const community = communityName ? useCommunity(communityName) : undefined;
}
