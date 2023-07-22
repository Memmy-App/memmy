import { ListingType } from "lemmy-js-client";
import React from "react";
import { HStack, Text, useTheme } from "native-base";
import { useRoute } from "@react-navigation/core";
import { OnPressMenuItemEventObject } from "react-native-ios-context-menu";
import { listingTypeOptions } from "../../../../types/ListingType";
import { ListingTypeContextMenu } from "../../../common/ContextMenu/ListingTypeContextMenu";
import SFIcon from "../../../common/icons/SFIcon";
import {
  useFeedListingType,
  useFeedsStore,
} from "../../../../stores/feeds/feedsStore";
import loadFeedPosts from "../../../../stores/feeds/actions/loadFeedPosts";

export function FeedListingTypeButton() {
  const { key } = useRoute();
  const listingType = useFeedListingType(key);

  const { colors } = useTheme();

  const onPress = (e: OnPressMenuItemEventObject) => {
    useFeedsStore.setState((state) => {
      const prev = state.feeds.get(key);

      prev.listingType = e.nativeEvent.actionKey as ListingType;
    });

    loadFeedPosts(key, {
      refresh: true,
      type: e.nativeEvent.actionKey as ListingType,
    }).then();
  };

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
