import React, { useCallback, useMemo } from "react";
import { useRoute } from "@react-navigation/core";
import { OnPressMenuItemEventObject } from "react-native-ios-context-menu";
import { SortType } from "lemmy-js-client";
import { useFeedSort, useFeedStore } from "@src/state/feed/feedStore";
import { loadFeedPosts } from "@src/state/feed/actions";
import HeaderIconButton from "@src/components/common/Button/HeaderIconButton";
import { FeedSortContextMenu } from "@src/components/contextMenus/feed/FeedSortContextMenu";
import { findOptionByKey } from "@src/helpers/general";
import { useOverallSortOptions } from "@src/components/contextMenus/useOverallSortOptions";

function FeedSortButton(): React.JSX.Element {
  const { key } = useRoute();
  const overallSortOptions = useOverallSortOptions();
  const sort = useFeedSort(key);

  const onPress = useCallback((e: OnPressMenuItemEventObject) => {
    useFeedStore.setState((state) => {
      const prev = state.feeds.get(key);

      if (!prev) return;

      prev.sortType = e.nativeEvent.actionKey as SortType;
    });

    loadFeedPosts(key, {
      refresh: true,
      sort: e.nativeEvent.actionKey as SortType,
    }).then();
  }, []);

  const icon = useMemo(
    () => findOptionByKey(overallSortOptions, sort!)?.icon,
    [sort]
  );

  return (
    <FeedSortContextMenu currentSelection={sort!} onPress={onPress}>
      <HeaderIconButton icon={icon!} />
    </FeedSortContextMenu>
  );
}

export default FeedSortButton;
