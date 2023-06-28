import React, { useEffect, useMemo } from "react";
import { HStack, Text, useTheme, VStack } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { Button, RefreshControl } from "react-native";
import Animated, { SlideOutUp } from "react-native-reanimated";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useInbox from "../../hooks/inbox/useInbox";
import ButtonTwo from "../../ui/buttons/ButtonTwo";
import { useAppSelector } from "../../../store";
import { selectSite } from "../../../slices/site/siteSlice";
import LoadingErrorView from "../../ui/Loading/LoadingErrorView";
import ILemmyComment from "../../../lemmy/types/ILemmyComment";
import CommentItem from "../../ui/comments/CommentItem";
import LoadingModalTransparent from "../../ui/Loading/LoadingModalTransparent";
import InboxTabs from "./InboxTabs";
import LoadingView from "../../ui/Loading/LoadingView";
import NoPostsView from "../../ui/Feed/NoPostsView";

function InboxScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const theme = useTheme();
  const inbox = useInbox();

  const { unread } = useAppSelector(selectSite);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button title="Mark All Read" onPress={() => {}} />,
    });
  }, []);

  const replyItem = ({ item }: { item: ILemmyComment }) => (
    <Animated.View exiting={SlideOutUp}>
      <CommentItem
        comment={item}
        setComments={inbox.setReplies}
        isReply
        isUnreadReply
        onPressOverride={() => {
          const commentPathArr = item.comment.comment.path.split(".");

          if (commentPathArr.length === 2) {
            inbox
              .onCommentReplyPress(
                item.comment.post.id,
                item.comment.comment.id
              )
              .then();
          } else {
            inbox
              .onCommentReplyPress(
                item.comment.post.id,
                Number(commentPathArr[commentPathArr.length - 2])
              )
              .then();
          }
        }}
        depth={2}
      />
    </Animated.View>
  );

  if (inbox.error) {
    return (
      <LoadingErrorView
        onRetryPress={() => {
          inbox.doLoad(inbox.selected, true);
        }}
      />
    );
  }

  const onUnreadPress = () => {};
  const onAllPress = () => {};
  const onRepliesPress = () => {};
  const onMentionsPress = () => {};
  const onMessagesPress = () => {};

  const header = useMemo(
    () => (
      <>
        <LoadingModalTransparent loading={inbox.loading} />
        <InboxTabs
          onUnreadPress={onUnreadPress}
          onAllPress={onAllPress}
          onRepliesPress={onRepliesPress}
          onMentionsPress={onMentionsPress}
          onMessagesPress={onMessagesPress}
          topSelected="unread"
          bottomSelected="replies"
        />
      </>
    ),
    []
  );

  const empty = useMemo(() => {
    if (inbox.loading) {
      return <LoadingView />;
    }
    if (!inbox.loading && inbox.error) {
      return <LoadingErrorView onRetryPress={() => {}} />;
    }
    return <NoPostsView />;
  }, []);

  return useMemo(
    () => (
      <VStack flex={1} backgroundColor={theme.colors.app.bg}>
        {inbox.selected === "replies" && (
          <>
            {(inbox.replies && inbox.replies.length === 0 && (
              <Text>No replies found.</Text>
            )) || (
              <FlashList
                renderItem={replyItem}
                data={inbox.replies}
                estimatedItemSize={100}
                refreshControl={
                  <RefreshControl
                    refreshing={inbox.refreshing}
                    onRefresh={() => inbox.doLoad("replies", true)}
                  />
                }
                ListHeaderComponent={header}
                ListEmptyComponent={empty}
              />
            )}
          </>
        )}
      </VStack>
    ),
    [inbox.replies, inbox.refreshing]
  );
}

export default InboxScreen;
