import { SortType } from "lemmy-js-client";
import React from "react";
import { UseFeed } from "../../../../hooks/feeds/useFeed";
import { overallSortOptions } from "../../../../types/SortOptions";
import HeaderIconButton from "../../../common/Buttons/HeaderIconButton";
import { FeedSortContextMenu } from "../../../common/ContextMenu/FeedSortContextMenu";
import SFIcon from "../../../common/icons/SFIcon";

interface Props {
  feed: UseFeed;
  onSortUpdate?: (key: SortType) => void;
}
function FeedSortButton({ feed, onSortUpdate }: Props) {
  return (
    <FeedSortContextMenu
      currentSelection={feed.sort}
      onPress={({ nativeEvent }) => {
        feed.setSort(nativeEvent.actionKey as SortType);
        onSortUpdate?.(nativeEvent.actionKey as SortType);
      }}
    >
      <HeaderIconButton
        icon={<SFIcon icon={overallSortOptions[feed.sort].icon} />}
      />
    </FeedSortContextMenu>
  );
}

export default FeedSortButton;
