import { useNavigation, useScrollToTop } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { PostView } from "lemmy-js-client";
import { HStack, View, useTheme } from "native-base";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, StyleSheet } from "react-native";
import {
  IconBaselineDensityMedium,
  IconListDetails,
} from "tabler-icons-react-native";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import {
  getCommunityFullName,
  removeReadPosts,
} from "../../../../helpers/LemmyHelpers";
import { ExtensionType, getLinkInfo } from "../../../../helpers/LinkHelper";
import { UseFeed } from "../../../../hooks/feeds/useFeed";
import {
  selectFeed,
  setDropdownVisible,
} from "../../../../slices/feed/feedSlice";
import { setSetting } from "../../../../slices/settings/settingsActions";
import { selectSettings } from "../../../../slices/settings/settingsSlice";
import HeaderIconButton from "../../../common/Buttons/HeaderIconButton";
import HideReadFAB from "../../../common/Buttons/HideReadFAB";
import LoadingErrorView from "../../../common/Loading/LoadingErrorView";
import LoadingView from "../../../common/Loading/LoadingView";
import NoResultView from "../../../common/NoResultView";
import RefreshControl from "../../../common/RefreshControl";
import CompactFeedItem from "./CompactFeedItem/CompactFeedItem";
import FeedFooter from "./FeedFooter";
import FeedHeaderDropdownDrawer from "./FeedHeaderDropdownDrawer";
import FeedItem from "./FeedItem/FeedItem";
import { Community, FeedOverflowButton } from "./FeedOverflowButton";
import FeedSortButton from "./FeedSortButton";
import { FeedTypeButton } from "./FeedTypeButton";
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
  const [endReached, setEndReached] = useState(false);
  const [showFab, setShowFab] = useState(true);

  // Global state props
  const { dropdownVisible } = useAppSelector(selectFeed);
  const { compactView, hideReadPostsOnFeed } = useAppSelector(selectSettings);

  // Refs
  const flashList = useRef<FlashList<any>>();
  const recycled = useRef({});

  // Other Hooks
  const { t } = useTranslation();
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
      fullName: getCommunityFullName(feed.community),
    };
  }, [firstPost, community]);

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => {
        if (dropdownVisible) {
          return (
            <Button
              title={t("Cancel")}
              onPress={() => dispatch(setDropdownVisible())}
              color={theme.colors.app.accent}
            />
          );
        }

        return (
          <HStack space={3}>
            <HeaderIconButton
              icon={
                compactView ? (
                  <SFIcon icon="list.bullet" />
                ) : (
                  <SFIcon icon="list.bullet.below.rectangle" />
                )
              }
              onPress={() =>
                dispatch(setSetting({ compactView: !compactView }))
              }
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
            {postCommunity ? (
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
            ) : (
              <FeedTypeButton
                feed={feed}
                onPress={() =>
                  flashList?.current?.scrollToOffset({
                    animated: true,
                    offset: 0,
                  })
                }
              />
            )}
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
