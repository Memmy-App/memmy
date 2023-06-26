import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HStack, Text, useTheme, VStack } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native";
import useInbox from "../../hooks/inbox/useInbox";
import ButtonTwo from "../../ui/buttons/ButtonTwo";
import { useAppSelector } from "../../../store";
import { selectSite } from "../../../slices/site/siteSlice";
import LoadingErrorView from "../../ui/Loading/LoadingErrorView";
import LoadingModal from "../../ui/Loading/LoadingModal";
import ILemmyComment from "../../../lemmy/types/ILemmyComment";
import CommentItem from "../../ui/comments/CommentItem";

function InboxScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const theme = useTheme();
  const inbox = useInbox();

  const { unread } = useAppSelector(selectSite);

  const replyItem = ({ item }: { item: ILemmyComment }) => (
    <CommentItem
      comment={item}
      setComments={inbox.setReplies}
      isReply
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
          inbox.doLoad(inbox.selected, true);
        }}
      />
    );
  }

  return (
    <VStack flex={1} backgroundColor={theme.colors.app.bg}>
      <LoadingModal loading={inbox.loading} />
      <HStack px={4} py={4} space={2}>
        <ButtonTwo
          onPress={() => {}}
          text="Unread"
          badge={(
            unread.replies +
            unread.privateMessage +
            unread.mentions
          ).toString()}
        />
        <ButtonTwo onPress={() => {}} text="All" />
      </HStack>
      <HStack px={4} py={2} space={2}>
        <ButtonTwo
          onPress={() => {}}
          text="Replies"
          badge={unread.replies.toString()}
        />
        <ButtonTwo
          onPress={() => {}}
          text="Mentions"
          badge={unread.mentions.toString()}
        />
        <ButtonTwo
          onPress={() => {}}
          text="Messages"
          badge={unread.privateMessage.toString()}
        />
      </HStack>
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
            />
          )}
        </>
      )}
    </VStack>
  );
}

export default InboxScreen;
