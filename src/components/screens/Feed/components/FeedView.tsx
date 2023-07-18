import {
  ParamListBase,
  useNavigation,
  useScrollToTop,
} from "@react-navigation/native";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { PostView } from "lemmy-js-client";
import { HStack, View, useTheme } from "native-base";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useAppSelector } from "../../../../../store";
import {
  getCommunityFullName,
  removeReadPosts,
} from "../../../../helpers/LemmyHelpers";
import { ExtensionType, getLinkInfo } from "../../../../helpers/LinkHelper";
import { UseFeed } from "../../../../hooks/feeds/useFeed";
import { selectFeed } from "../../../../slices/feed/feedSlice";
import { selectSettings } from "../../../../slices/settings/settingsSlice";
import HideReadFAB from "../../../common/Buttons/HideReadFAB";
import LoadingErrorView from "../../../common/Loading/LoadingErrorView";
import LoadingView from "../../../common/Loading/LoadingView";
import NoResultView from "../../../common/NoResultView";
import RefreshControl from "../../../common/RefreshControl";
import CommunityOverflowButton, { Community } from "./CommunityOverflowButton";
import CompactFeedItem from "./CompactFeedItem/CompactFeedItem";
import FeedFooter from "./FeedFooter";
import FeedItem from "./FeedItem/FeedItem";
import { FeedListingTypeButton } from "./FeedListingTypeButton";
import { FeedOverflowButton } from "./FeedOverflowButton";
import FeedSortButton from "./FeedSortButton";
import IconButtonWithText from "../../../common/IconButtonWithText";
import SFIcon from "../../../common/icons/SFIcon";

interface FeedViewProps {
  feed: UseFeed;
  community?: boolean;
  header?: () => JSX.Element | null;
}

function FeedView({ feed, community = false, header }: FeedViewProps) {
  // State Props
  // TODO Handle this
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showFab, setShowFab] = useState(true);

  // Global state props
  const { dropdownVisible } = useAppSelector(selectFeed);
  const { compactView, hideReadPostsOnFeed } = useAppSelector(selectSettings);

  // Refs
  const flashList = useRef<FlashList<any>>();
  const recycled = useRef({});

  // Other Hooks
  const theme = useTheme();
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  useScrollToTop(flashList);

  useEffect(
    () => () => {
      recycled.current = null;
    },
    []
  );

  const firstPost = (feed.posts?.length ?? 0) > 0 ? feed.posts[0] : undefined;

  const postCommunity: Community = useMemo(() => {
    if (!firstPost || !community) return undefined;

    return {
      id: firstPost.community.id,
      name: firstPost.community.name,
      fullName: getCommunityFullName(feed.community),
    };
  }, [firstPost, community]);

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <HStack space={3}>
          <FeedSortButton
            feed={feed}
            onSortUpdate={() =>
              flashList?.current?.scrollToOffset({
                animated: true,
                offset: 0,
              })
            }
          />
          {postCommunity ? (
            <CommunityOverflowButton community={postCommunity} />
          ) : (
            <FeedOverflowButton />
          )}
        </HStack>
      ),
    });

    if (!community) {
      navigation.setOptions({
        // eslint-disable-next-line react/no-unstable-nested-components
        headerTitle: () => (
          <FeedListingTypeButton
            feed={feed}
            onPress={() =>
              flashList?.current?.scrollToOffset({
                animated: true,
                offset: 0,
              })
            }
          />
        ),
        // eslint-disable-next-line react/no-unstable-nested-components
        headerLeft: () => (
          <IconButtonWithText
            icon={<SFIcon icon="list.dash" style={{ marginLeft: 20 }} />}
            onPressHandler={navigation.openDrawer}
          />
        ),
      });
    }
  }, [feed.posts, feed.community, postCommunity, dropdownVisible]);

  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<PostView>) => {
      if (feed.community && feed.community.counts.posts < 1) {
        return <NoResultView type="posts" />;
      }

      if (compactView) {
        return <CompactFeedItem post={item} setPosts={feed.setPosts} />;
      }

      return (
        <FeedItem post={item} setPosts={feed.setPosts} recycled={recycled} />
      );
    },
    [feed.community, compactView]
  );

  const onEndReached = React.useCallback(
    () => feed.posts && feed.doLoad(),
    [feed]
  );

  const getItemType = React.useCallback(
    (item: PostView): string | undefined => {
      const linkType = getLinkInfo(item.post.url);

      if (
        linkType.extType === ExtensionType.GENERIC &&
        item.post.thumbnail_url
      ) {
        return "thumbnail_link";
      }
      if (linkType.extType === ExtensionType.IMAGE) {
        return "image";
      }
      return undefined;
    },
    []
  );

  const refreshControl = (
    <RefreshControl
      refreshing={feed.postsLoading}
      onRefresh={() => feed.doLoad(true)}
    />
  );

  return (
    <View style={styles.container} backgroundColor={theme.colors.app.bg}>
      {(feed.postsLoading && !feed.posts && <LoadingView />) ||
        (feed.postsError && !feed.posts && (
          <LoadingErrorView onRetryPress={() => feed.doLoad(true)} />
        )) ||
        (feed.community && feed.community.counts.posts < 1 && (
          <>
            {header()}
            <NoResultView type="posts" />
          </>
        )) || (
          <FlashList
            ListHeaderComponent={header}
            data={feed.posts}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            extraData={{
              refreshList: feed.refreshList,
              compactView,
            }}
            refreshControl={refreshControl}
            onEndReachedThreshold={0.5}
            onEndReached={onEndReached}
            estimatedItemSize={compactView ? 100 : 500}
            ListFooterComponent={
              <FeedFooter
                loading={feed.postsLoading && feed.posts.length > 0}
                error={feed.postsError}
                empty={(feed.posts ?? []).length === 0}
                onRetry={feed.doLoad}
              />
            }
            ListEmptyComponent={<NoResultView type="posts" />}
            ref={flashList}
            getItemType={getItemType}
            onMomentumScrollBegin={() => {
              setShowFab(false);
            }}
            onMomentumScrollEnd={() => {
              setShowFab(true);
            }}
          />
        )}
      {hideReadPostsOnFeed && showFab && (
        <HideReadFAB
          onPress={() => {
            feed.setPosts(removeReadPosts(feed.posts));
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
