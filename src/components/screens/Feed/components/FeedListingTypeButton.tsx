import { ListingType } from "lemmy-js-client";
import React, { useCallback } from "react";
import { HStack, Text, useTheme } from "native-base";
import { useRoute } from "@react-navigation/core";
import { listingTypeOptions } from "../../../../types/ListingType";
import { ListingTypeContextMenu } from "../../../common/ContextMenu/ListingTypeContextMenu";
import SFIcon from "../../../common/icons/SFIcon";
import {
  useFeedListingType,
  useFeedsStore,
} from "../../../../stores/feeds/feedsStore";

export function FeedListingTypeButton() {
  const { key } = useRoute();
  const listingType = useFeedListingType(key);

  const { colors } = useTheme();

  const onPress = useCallback((nativeEvent) => {
    useFeedsStore.setState((state) => {
      const prev = state.feeds.get(key);

      prev.listingType = nativeEvent.actionKey as ListingType;
    });
  }, []);

  return (
    <ListingTypeContextMenu currentSelection={listingType} onPress={onPress}>
      <HStack space={0.5} alignItems="center">
        <Text
          color={colors.app.textPrimary}
          fontSize="16"
          fontWeight="semibold"
        >
          {listingTypeOptions[listingType].display}
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
