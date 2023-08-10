import { useCallback, useRef } from "react";
import ViewableItemsChangedType from "@src/types/ViewableItemsChangedType";
import { PostView } from "lemmy-js-client";
import { useSettingsStore } from "@src/state/settings/settingsStore";
import { useRoute } from "@react-navigation/core";

interface UseMarkReadOnScroll {
  onViewableItemsChanged:
    | undefined
    | ((info?: ViewableItemsChangedType<PostView>) => void);
}

export const useMarkReadOnScroll = (): UseMarkReadOnScroll => {
  const { key } = useRoute();

  const { markReadOnFeedScroll, markReadOnCommunityScroll } = useSettingsStore(
    (state) => ({
      markReadOnFeedScroll: state.markReadOnFeedScroll,
      markReadOnCommunityScroll: state.markReadOnCommunityScroll,
    })
  );

  const onViewableItemsChanged = useRef<
    undefined | ((info?: ViewableItemsChangedType<PostView>) => void)
  >();

  const markReadOnScroll = (info?: ViewableItemsChangedType<PostView>) => {
    if (
      (markReadOnCommunityScroll && key.includes("Community")) ||
      (markReadOnFeedScroll && key.includes("FeedScreen"))
    ) {
      // Try to get the first item
      const firstItem = info?.viewableItems ? info.viewableItems[0] : null;

      if (firstItem && !firstItem.item?.read) {
        // Set read
      }
    }
  };

  onViewableItemsChanged.current = useCallback(
    (info?: ViewableItemsChangedType<PostView>) => {
      markReadOnScroll(info);
    },
    [markReadOnFeedScroll, markReadOnCommunityScroll]
  );

  return {
    onViewableItemsChanged: onViewableItemsChanged.current,
  };
};
