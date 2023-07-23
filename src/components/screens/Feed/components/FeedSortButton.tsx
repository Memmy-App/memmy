import React, { useCallback, useMemo } from "react";
import { useRoute } from "@react-navigation/core";
import { OnPressMenuItemEventObject } from "react-native-ios-context-menu";
import { SortType } from "lemmy-js-client";
import HeaderIconButton from "../../../common/Buttons/HeaderIconButton";
import { FeedSortContextMenu } from "../../../common/ContextMenu/FeedSortContextMenu";
import SFIcon from "../../../common/icons/SFIcon";
import {
  useFeedSort,
  useFeedsStore,
} from "../../../../stores/feeds/feedsStore";
import loadFeedPosts from "../../../../stores/feeds/actions/loadFeedPosts";
import { findOptionByKey } from "../../../../helpers/ContextMenuOptionsHelper";
import { useOverallSortOptions } from "../../../../hooks/contextMenu/useOverallSortOptions";

function FeedSortButton() {
  const { key } = useRoute();
  const overallSortOptions = useOverallSortOptions();
  const sort = useFeedSort(key);

  const onPress = useCallback((e: OnPressMenuItemEventObject) => {
    useFeedsStore.setState((state) => {
      state.feeds.get(key).sortType = e.nativeEvent.actionKey as SortType;
    });

    loadFeedPosts(key, {
      refresh: true,
      sort: e.nativeEvent.actionKey as SortType,
    }).then();
  }, []);

  const icon = useMemo(
    () => <SFIcon icon={findOptionByKey(overallSortOptions, sort).icon} />,
    [sort]
  );

  return (
    <FeedSortContextMenu currentSelection={sort} onPress={onPress}>
      <HeaderIconButton icon={icon} />
    </FeedSortContextMenu>
  );
}

export default FeedSortButton;
