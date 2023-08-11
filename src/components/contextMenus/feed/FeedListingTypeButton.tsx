import { ListingType } from "lemmy-js-client";
import React from "react";
import { HStack, Text } from "@src/components/gluestack";
import { useRoute } from "@react-navigation/core";
import { OnPressMenuItemEventObject } from "react-native-ios-context-menu";
import { useFeedListingType, useFeedStore } from "@src/state/feed/feedStore";
import { useThemeOptions } from "@src/state/settings/settingsStore";
import { useListingTypeOptions } from "@src/components/contextMenus/feed/useListingTypeOptions";
import { loadFeedPosts } from "@src/state/feed/actions";
import { SFIcon } from "@src/components/common/icons/SFIcon";
import { findOptionByKey } from "@src/helpers/general";
import { ListingTypeContextMenu } from "@src/components/contextMenus/feed/ListingTypeContextMenu";

export function FeedListingTypeButton(): React.JSX.Element {
  const { key } = useRoute();
  const listingType = useFeedListingType(key);

  const { colors } = useThemeOptions();
  const listingTypeOptions = useListingTypeOptions();

  const onPress = (e: OnPressMenuItemEventObject) => {
    useFeedStore.setState((state) => {
      const prev = state.feeds.get(key);

      if (!prev) return;

      prev.listingType = e.nativeEvent.actionKey as ListingType;
    });

    loadFeedPosts(key, {
      refresh: true,
      type: e.nativeEvent.actionKey as ListingType,
    }).then();
  };

  return (
    <ListingTypeContextMenu currentSelection={listingType!} onPress={onPress}>
      <HStack space="xxs" alignItems="center">
        <Text color={colors.textPrimary} size="md" fontWeight="semibold">
          {findOptionByKey(listingTypeOptions, listingType!)!.title}
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
