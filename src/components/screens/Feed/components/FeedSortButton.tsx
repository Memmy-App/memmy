import { SortType } from "lemmy-js-client";
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

function FeedSortButton() {
  const { key } = useRoute();
  const sort = useFeedSort(key);

  const onPress = useCallback((nativeEvent) => {
    useFeedsStore.setState((state) => {
      const prev = state.feeds.get(key);

      prev.sortType = nativeEvent.actionKey as SortType;
    });
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
