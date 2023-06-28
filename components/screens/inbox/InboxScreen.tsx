import React, { useEffect, useMemo } from "react";
import { Text, useTheme, VStack } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { Button, RefreshControl } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useInbox from "../../hooks/inbox/useInbox";
import { useAppSelector } from "../../../store";
import { selectSite } from "../../../slices/site/siteSlice";
import LoadingErrorView from "../../ui/Loading/LoadingErrorView";
import ILemmyComment from "../../../lemmy/types/ILemmyComment";
import CommentItem from "../../ui/comments/CommentItem";
import LoadingModalTransparent from "../../ui/Loading/LoadingModalTransparent";
import InboxTabs from "./InboxTabs";
import LoadingView from "../../ui/Loading/LoadingView";

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
      headerRight: () => (
        <Button title="Mark All Read" onPress={inbox.doReadAll} />
      ),
    });
  }, []);

  const replyItem = ({ item }: { item: ILemmyComment }) => (
    <CommentItem
      comment={item}
      setComments={inbox.setItems}
      isReply
      isUnreadReply
      onPressOverride={() => {
        const commentPathArr = item.comment.comment.path.split(".");

        if (commentPathArr.length === 2) {
          inbox
            .onCommentReplyPress(item.comment.post.id, item.comment.comment.id)
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
  );

  if (inbox.error) {
    return (
      <LoadingErrorView
        onRetryPress={() => {
          inbox.doLoad(true);
        }}
      />
    );
  }

  const onUnreadPress = () => {
    inbox.setTopSelected("unread");
  };
  const onAllPress = () => {
    inbox.setTopSelected("all");
    console.log("pressed");
  };
  const onRepliesPress = () => {
    inbox.setBottomSelected("replies");
  };
  const onMentionsPress = () => {};
  const onMessagesPress = () => {};

  const header = useMemo(
    () => (
      <>
        <InboxTabs
          onUnreadPress={onUnreadPress}
          onAllPress={onAllPress}
          onRepliesPress={onRepliesPress}
          onMentionsPress={onMentionsPress}
          onMessagesPress={onMessagesPress}
          topSelected={inbox.topSelected}
          bottomSelected={inbox.bottomSelected}
        />
      </>
    ),
    [inbox.topSelected, inbox.bottomSelected]
  );

  const empty = useMemo(() => {
    if (inbox.loading) {
      return <LoadingView />;
    }
    if (!inbox.loading && inbox.error) {
      return <LoadingErrorView onRetryPress={() => {}} />;
    }

    return (
      <VStack p={4} alignItems="center" justifyContent="center">
        <Text fontStyle="italic">Nothing found in your inbox.</Text>
      </VStack>
    );
  }, []);

  return useMemo(
    () => (
      <VStack flex={1} backgroundColor={theme.colors.app.bg}>
        <LoadingModalTransparent loading={inbox.loading} />
        <FlashList
          renderItem={replyItem}
          data={inbox.items}
          estimatedItemSize={100}
          refreshControl={
            <RefreshControl
              refreshing={inbox.refreshing}
              onRefresh={() => inbox.doLoad(true)}
            />
          }
          ListHeaderComponent={header}
          ListEmptyComponent={empty}
        />
      </VStack>
    ),
    [
      inbox.items,
      inbox.loading,
      inbox.refreshing,
      inbox.topSelected,
      inbox.bottomSelected,
    ]
  );
}

export default InboxScreen;
