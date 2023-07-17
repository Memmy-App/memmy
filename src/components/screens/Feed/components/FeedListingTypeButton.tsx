import { ListingType } from "lemmy-js-client";
import React from "react";
import { HStack, Text, useTheme } from "native-base";
import { UseFeed } from "../../../../hooks/feeds/useFeed";
import { listingTypeOptions } from "../../../../types/ListingType";
import { ListingTypeContextMenu } from "../../../common/ContextMenu/ListingTypeContextMenu";
import SFIcon from "../../../common/icons/SFIcon";

interface Props {
  feed: UseFeed;
  onPress?: () => void;
}

export function FeedListingTypeButton({ feed, onPress }: Props) {
  const { colors } = useTheme();
  return (
    <ListingTypeContextMenu
      currentSelection={feed.listingType}
      onPress={({ nativeEvent }) => {
        feed.setListingType(nativeEvent.actionKey as ListingType);
        onPress();
      }}
    >
      <HStack space={0.5} alignItems="center">
        <Text
          color={colors.app.textPrimary}
          fontSize="16"
          fontWeight="semibold"
        >
          {listingTypeOptions[feed.listingType].display}
        </Text>
        <SFIcon
          icon="chevron.down"
          color={colors.app.textPrimary}
          size={12}
          weight="semibold"
        />
      </HStack>
    </ListingTypeContextMenu>
  );
}
