import React, { useCallback, useMemo } from "react";
import { useRoute } from "@react-navigation/core";
import { overallSortOptions } from "../../../../types/SortOptions";
import HeaderIconButton from "../../../common/Buttons/HeaderIconButton";
import { FeedSortContextMenu } from "../../../common/ContextMenu/FeedSortContextMenu";
import SFIcon from "../../../common/icons/SFIcon";
import {
  useFeedSort,
  useFeedsStore,
} from "../../../../stores/feeds/feedsStore";
import loadFeedPosts from "../../../../stores/feeds/actions/loadFeedPosts";

function FeedSortButton() {
  const { key } = useRoute();
  const sort = useFeedSort(key);

  const onPress = useCallback((e) => {
    useFeedsStore.setState((state) => {
      state.feeds.get(key).sortType = e.nativeEvent.actionKey;
    });

    loadFeedPosts(key, {
      refresh: true,
      sort: e.nativeEvent.actionKey,
    }).then();
  }, []);

  const icon = useMemo(
    () => <SFIcon icon={overallSortOptions[sort].icon} />,
    [sort]
  );

  return (
    <FeedSortContextMenu currentSelection={sort} onPress={onPress}>
      <HeaderIconButton icon={icon} />
    </FeedSortContextMenu>
  );
}

export default FeedSortButton;
