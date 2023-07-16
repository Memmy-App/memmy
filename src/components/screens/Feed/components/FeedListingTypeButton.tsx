import { ListingType } from "lemmy-js-client";
import React from "react";
import { UseFeed } from "../../../../hooks/feeds/useFeed";
import { listingTypeOptions } from "../../../../types/ListingType";
import HeaderIconButton from "../../../common/Buttons/HeaderIconButton";
import { ListingTypeContextMenu } from "../../../common/ContextMenu/ListingTypeContextMenu";
import SFIcon from "../../../common/icons/SFIcon";

interface Props {
  feed: UseFeed;
  onPress?: () => void;
}

export function FeedListingTypeButton({ feed, onPress }: Props) {
  return (
    <ListingTypeContextMenu
      currentSelection={feed.listingType}
      onPress={({ nativeEvent }) => {
        feed.setListingType(nativeEvent.actionKey as ListingType);
        onPress();
      }}
    >
      <HeaderIconButton
        icon={<SFIcon icon={listingTypeOptions[feed.listingType].icon} />}
      />
    </ListingTypeContextMenu>
  );
}
