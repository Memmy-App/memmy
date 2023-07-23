import {
  ParamListBase,
  useNavigation,
  useScrollToTop,
} from "@react-navigation/native";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { PostView } from "lemmy-js-client";
import { HStack, View } from "@components/common/Gluestack";
import {
  selectSettings,
  selectThemeOptions,
} from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { StyleSheet } from "react-native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useRoute } from "@react-navigation/core";
import { ExtensionType, getLinkInfo } from "../../../../helpers/LinkHelper";
import {
  clearUpdateSaved,
  clearUpdateVote,
  selectFeed,
} from "../../../../slices/feed/feedSlice";
import LoadingErrorView from "../../../common/Loading/LoadingErrorView";
import LoadingView from "../../../common/Loading/LoadingView";
import NoResultView from "../../../common/NoResultView";
import RefreshControl from "../../../common/RefreshControl";
import CommunityOverflowButton from "./Community/CommunityOverflowButton";
import CompactFeedItem from "./CompactFeedItem/CompactFeedItem";
import FeedFooter from "./FeedFooter";
import FeedItem from "./FeedItem/FeedItem";
import { FeedListingTypeButton } from "./FeedListingTypeButton";
import { FeedOverflowButton } from "./FeedOverflowButton";
import FeedSortButton from "./FeedSortButton";
import IconButtonWithText from "../../../common/IconButtonWithText";
import SFIcon from "../../../common/icons/SFIcon";
import {
  useFeedCommunityName,
  useFeedListingType,
  useFeedPosts,
  useFeedSort,
  useFeedsStore,
  useFeedStatus,
} from "../../../../stores/feeds/feedsStore";
import { useCommunity } from "../../../../stores/communities/communitiesStore";
import loadFeedPosts from "../../../../stores/feeds/actions/loadFeedPosts";
import HideReadFAB from "../../../common/Buttons/HideReadFAB";
import setFeedPosts from "../../../../stores/feeds/actions/setFeedPosts";
import { removeReadPosts } from "../../../../helpers/LemmyHelpers";
import { useSaved, useVoted } from "../../../../stores/updates/updatesStore";
import setFeedRead from "../../../../stores/feeds/actions/setFeedRead";

interface FeedViewProps {
  header?: () => React.ReactNode;
}

interface ViewToken<T = any> {
  item?: T;
  key: string;
  index: number | null;
  isViewable: boolean;
  timestamp: number;
}

type ViewableItemsChangedType<T> = {
  viewableItems?: ViewToken<T>[];
  changed: ViewToken<T>[];
};

function FeedView({ header }: FeedViewProps) {
  const {
    hideReadPostsOnFeed,
    showHideReadButton,
    markReadOnFeedScroll,
    markReadOnCommunityScroll,
  } = useAppSelector(selectSettings);

  const { key } = useRoute();

  // Global state props
  const { dropdownVisible } = useAppSelector(selectFeed);
  const { compactView } = useAppSelector(selectSettings);

  const posts = useFeedPosts(key);
  const status = useFeedStatus(key);

  const communityName = useFeedCommunityName(key);
  const community = communityName ? useCommunity(communityName) : undefined;

  const sortType = useFeedSort(key);
  const listingType = useFeedListingType(key);

  const voted = useVoted();
  const saved = useSaved();

  const onViewableItemsChanged = useRef<any>();

  // Refs
  const flashList = useRef<FlashList<any>>();
  const recycled = useRef({});

  // Other Hooks
  const theme = useAppSelector(selectThemeOptions);
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  useScrollToTop(flashList);

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
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
            icon={<SFIcon icon="list.dash" style={{ marginLeft: 5 }} />}
            onPressHandler={navigation.openDrawer}
          />
        ),
      });
    }
  }, [posts, community, dropdownVisible, sortType, compactView]);

  useEffect(() => {
    flashList?.current?.scrollToOffset({
      animated: true,
      offset: 0,
    });
  }, [sortType, listingType]);

  useEffect(() => {
    if (voted) {
      useFeedsStore.setState((state) => {
        const prev = state.feeds
          .get(key)
          .posts.find((p) => p.post.id === voted.postId);

        if (!prev) return;

        prev.my_vote = voted.value;
      });
    }

    clearUpdateVote();
  }, [voted]);

  useEffect(() => {
    if (saved) {
      useFeedsStore.setState((state) => {
        const prev = state.feeds
          .get(key)
          .posts.find((p) => p.post.id === saved.postId);

        if (!prev) return;

        prev.saved = saved.saved;
      });
    }

    clearUpdateSaved();
  });

  const markReadOnScroll = (info?: ViewableItemsChangedType<PostView>) => {
    if (
      (markReadOnCommunityScroll && key.includes("Community")) ||
      (markReadOnFeedScroll && key.includes("FeedScreen"))
    ) {
      const firstItem = info.viewableItems ? info.viewableItems[0] : null;
      if (!!firstItem && !!firstItem.item) {
        if (firstItem.item.read) return;

        setFeedRead(key, firstItem.item.post.id);
      }
    }
  };

  onViewableItemsChanged.current = useCallback(
    (info?: ViewableItemsChangedType<PostView>) => {
      markReadOnScroll(info);
    },
    [markReadOnFeedScroll, markReadOnCommunityScroll]
  );

  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<PostView>) => {
      if (!status?.loading && posts?.length < 1) {
        return <NoResultView type="posts" />;
      }

      if (compactView) {
        return <CompactFeedItem postId={item.post.id} />;
      }

      return <FeedItem postId={item.post.id} recycled={recycled} />;
    },
    [compactView]
  );

  const onEndReached = () => loadFeedPosts(key, { refresh: false });

  const onRefresh = () => loadFeedPosts(key, { refresh: true });

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

  const refreshControl = useMemo(
    () => <RefreshControl refreshing={status?.loading} onRefresh={onRefresh} />,
    [status?.loading]
  );

  return (
    <View style={styles.container} backgroundColor={theme.colors.bg}>
      {(status?.loading && posts?.length < 1 && <LoadingView />) || // TODO LENGTH
        (status?.error && posts?.length < 1 && (
          <LoadingErrorView onRetryPress={onRefresh} />
        )) || (
          <FlashList
            ListHeaderComponent={header}
            data={posts ?? []}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            extraData={{
              refreshList: status?.refresh,
              compactView,
            }}
            refreshControl={refreshControl}
            onEndReachedThreshold={0.5}
            onEndReached={onEndReached}
            estimatedItemSize={compactView ? 100 : 500}
            ListFooterComponent={<FeedFooter />}
            ListEmptyComponent={<NoResultView type="posts" />}
            ref={flashList}
            getItemType={getItemType}
            onViewableItemsChanged={(info) =>
              onViewableItemsChanged.current(info)
            }
          />
        )}
      {hideReadPostsOnFeed && showHideReadButton && (
        <HideReadFAB
          onPress={() => {
            setFeedPosts(key, removeReadPosts(posts));
          }}
        />
      )}
    </View>
  );
}

const keyExtractor = (item: PostView) => item.post.id.toString();

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default FeedView;
