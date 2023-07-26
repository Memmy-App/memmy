import { ListingType } from "lemmy-js-client";
import React from "react";
import { HStack, Text } from "@src/components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";
import { useRoute } from "@react-navigation/core";
import { OnPressMenuItemEventObject } from "react-native-ios-context-menu";
import { ListingTypeContextMenu } from "../../../common/ContextMenu/ListingTypeContextMenu";
import SFIcon from "../../../common/icons/SFIcon";
import {
  useFeedListingType,
  useFeedsStore,
} from "../../../../stores/feeds/feedsStore";
import loadFeedPosts from "../../../../stores/feeds/actions/loadFeedPosts";
import { findOptionByKey } from "../../../../helpers/ContextMenuOptionsHelper";
import { useListingTypeOptions } from "../../../../hooks/contextMenu/useListingTypeOptions";

export function FeedListingTypeButton() {
  const { key } = useRoute();
  const listingType = useFeedListingType(key);

  const { colors } = useAppSelector(selectThemeOptions);
  const listingTypeOptions = useListingTypeOptions();

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
      <HStack space="xxs" alignItems="center">
        <Text color={colors.textPrimary} size="md" fontWeight="semibold">
          {findOptionByKey(listingTypeOptions, listingType).title}
        </Text>
        <SFIcon
          icon="chevron.down"
          color={colors.textPrimary}
          size={12}
          weight="semibold"
        />
      </HStack>
    </ListingTypeContextMenu>
  );
}
