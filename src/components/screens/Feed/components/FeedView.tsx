import React, { useEffect, useMemo, useRef, useState } from "react";
import { PostView } from "lemmy-js-client";
import { HStack, useTheme, View } from "native-base";
import { Button, StyleSheet } from "react-native";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { useNavigation, useScrollToTop } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  IconArrowsMaximize,
  IconArrowsMinimize,
} from "tabler-icons-react-native";
import FeedItem from "./FeedItem/FeedItem";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import {
  selectFeed,
  setDropdownVisible,
} from "../../../../slices/feed/feedSlice";
import { UseFeed } from "../../../../hooks/feeds/useFeed";
import { setSetting } from "../../../../slices/settings/settingsActions";
import { selectSettings } from "../../../../slices/settings/settingsSlice";
import FeedSortButton from "./FeedSortButton";
import { Community, FeedOverflowButton } from "./FeedOverflowButton";
import NoResultView from "../../../common/NoResultView";
import CompactFeedItem from "./CompactFeedItem/CompactFeedItem";
import { ExtensionType, getLinkInfo } from "../../../../helpers/LinkHelper";
import RefreshControl from "../../../common/RefreshControl";
import FeedHeaderDropdownDrawer from "./FeedHeaderDropdownDrawer";
import LoadingView from "../../../common/Loading/LoadingView";
import LoadingErrorView from "../../../common/Loading/LoadingErrorView";
import FeedFooter from "./FeedFooter";
import { removeReadPosts } from "../../../../helpers/LemmyHelpers";
import HeaderIconButton from "../../../common/Buttons/HeaderIconButton";
import HideReadFAB from "../../../common/Buttons/HideReadFAB";

interface FeedViewProps {
  feed: UseFeed;
  community?: boolean;
  header?: () => JSX.Element | null;
}

function FeedView({ feed, community = false, header }: FeedViewProps) {
  // State Props
  // TODO Handle this
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [endReached, setEndReached] = useState(false);
  const [showFab, setShowFab] = useState(true);

  // Global state props
  const { dropdownVisible } = useAppSelector(selectFeed);
  const { compactView, hideReadPostsOnFeed } = useAppSelector(selectSettings);

  // Refs
  const flashList = useRef<FlashList<any>>();
  const recycled = useRef({});

  // Other Hooks
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();

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
    };
  }, [firstPost, community]);

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => {
        if (dropdownVisible) {
          return (
            <Button
              title="Cancel"
              onPress={() => dispatch(setDropdownVisible())}
            />
          );
        }

        return (
          <HStack space={1}>
            <HeaderIconButton
              icon={compactView ? <IconArrowsMaximize /> : <IconArrowsMinimize />}
              onPress={() => dispatch(setSetting({ compactView: !compactView}))}
            />
            <FeedSortButton
              feed={feed}
              onSortUpdate={() =>
                flashList?.current?.scrollToOffset({
                  animated: true,
                  offset: 0,
                })
              }
            />
            <FeedOverflowButton
              feed={feed}
              community={postCommunity}
              onPress={() =>
                flashList?.current?.scrollToOffset({
                  animated: true,
                  offset: 0,
                })
              }
            />
          </HStack>
        );
      },
    });
  }, [feed, postCommunity, dropdownVisible]);

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
      <FeedHeaderDropdownDrawer />

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
                loading={
                  (feed.postsLoading && feed.posts.length > 0) || endReached
                }
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
