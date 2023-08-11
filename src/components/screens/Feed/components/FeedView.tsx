import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  useSettingsStore,
  useThemeOptions,
} from "@src/state/settings/settingsStore";
import { ParamListBase, useNavigation, useRoute } from "@react-navigation/core";
import {
  useFeedCommunityName,
  useFeedListingType,
  useFeedPosts,
  useFeedSort,
  useFeedStatus,
} from "@src/state/feed/feedStore";
import { useCommunity } from "@src/state/community/communityStore";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useScrollToTop } from "@react-navigation/native";
import { PostView } from "lemmy-js-client";
import { useMarkReadOnScroll } from "@src/hooks/feed";
import { HStack, View } from "@src/components/gluestack";
import { ExtensionType, getLinkInfo } from "@src/helpers/links";
import { loadFeedPosts } from "@src/state/feed/actions";
import RefreshControl from "@src/components/common/RefreshControl/RefreshControl";
import { debounce } from "@src/helpers/general";
import { FeedItem } from "@src/components/screens/Feed/components/FeedItem";
import IconButtonWithText from "@src/components/common/Button/IconButtonWithText";
import FeedSortButton from "@src/components/screens/Feed/components/FeedSortButton";
import { FeedListingTypeButton } from "@src/components/contextMenus/feed/FeedListingTypeButton";
import { FeedOverflowButton } from "@src/components/contextMenus/feed/FeedOverflowButton";

interface IProps {
  header?: () => React.JSX.Element;
}

export function FeedView({ header }: IProps): React.JSX.Element {
  const { key } = useRoute();

  const { hideReadPostsOnFeed, showHideReadButton, compactView } =
    useSettingsStore((state) => ({
      hideReadPostsOnFeed: state.hideReadPostsOnFeed,
      showHideReadButton: state.showHideReadButton,
      compactView: state.compactView,
    }));

  const posts = useFeedPosts(key);
  const status = useFeedStatus(key);

  const communityName = useFeedCommunityName(key);
  const community = communityName ? useCommunity(communityName) : undefined;

  const sortType = useFeedSort(key);
  const listingType = useFeedListingType(key);

  const flashList = useRef<FlashList<any>>();
  const recycled = useRef(new Map<string, {}>());
  const loadingData = useRef(false);

  const theme = useThemeOptions();
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  const markReadOnScroll = useMarkReadOnScroll();

  // We have to use "as any" here because it's supposed to be a FlatList
  useScrollToTop(flashList as any);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HStack space="md">
          <FeedSortButton />
          {community ? <CommunityOverflowButton /> : <FeedOverflowButton />}
        </HStack>
      ),
    });

    if (!community) {
      navigation.setOptions({
        // eslint-disable-next-line react/no-unstable-nested-components
        headerTitle: () => <FeedListingTypeButton />,
        // eslint-disable-next-line react/no-unstable-nested-components
        headerLeft: () => (
          <IconButtonWithText
            icon="list.dash"
            style={{ marginLeft: 5 }}
            onPress={navigation.openDrawer}
          />
        ),
      });
    }
  }, [community, sortType, compactView]);

  // This handles scrolling to top whenever we change sort options
  useEffect(() => {
    flashList?.current?.scrollToOffset({
      animated: true,
      offset: 0,
    });
  }, [sortType, listingType]);

  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<PostView>) => {
      if (compactView) {
        return null;
      }

      return <FeedItem postId={item.post.id} recycled={recycled} />;
    },
    [compactView]
  );

  const onEndReached = useCallback(() => {
    if (!loadingData.current) {
      loadingData.current = true;
      loadFeedPosts(key, { refresh: false }).then(() => {
        loadingData.current = false;
      });
    }
  }, [posts]);

  const onRefresh = useCallback(() => {
    if (!loadingData.current) {
      loadingData.current = true;
      loadFeedPosts(key, { refresh: true }).then(() => {
        loadingData.current = false;
      });
    }
  }, [posts]);

  const refreshControl = useMemo(
    () => (
      <RefreshControl refreshing={!!status?.loading} onRefresh={onRefresh} />
    ),
    [status?.loading]
  );

  return (
    <View flex={1} backgroundColor={theme.colors.bg}>
      <FlashList
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        data={posts}
        extraData={{
          refreshList: status?.refresh,
        }}
        refreshControl={refreshControl}
        onEndReachedThreshold={0.5}
        onEndReached={debounce(onEndReached, 100)}
        estimatedItemSize={compactView ? 100 : 500}
        ref={flashList as any}
        getItemType={getItemType}
        onViewableItemsChanged={markReadOnScroll.onViewableItemsChanged}
      />
    </View>
  );
}

const keyExtractor = (item: PostView) => item.post.id.toString();

const getItemType = (item: PostView): string | undefined => {
  const linkType = getLinkInfo(item.post.url);

  if (linkType.extType === ExtensionType.GENERIC && item.post.thumbnail_url) {
    return "thumbnail_link";
  }
  if (linkType.extType === ExtensionType.IMAGE) {
    return "image";
  }
  return undefined;
};
