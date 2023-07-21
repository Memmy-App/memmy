import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { VStack, useTheme } from "native-base";
import React, { useCallback, useEffect, useMemo } from "react";
import { CommentReplyView } from "lemmy-js-client";
import { useFocusEffect } from "@react-navigation/native";
import useInbox from "../../../hooks/inbox/useInbox";
import ILemmyComment from "../../../types/lemmy/ILemmyComment";
import HeaderIconButton from "../../common/Buttons/HeaderIconButton";
import LoadingErrorView from "../../common/Loading/LoadingErrorView";
import LoadingView from "../../common/Loading/LoadingView";
import NoResultView from "../../common/NoResultView";
import RefreshControl from "../../common/RefreshControl";
import SFIcon from "../../common/icons/SFIcon";
import InboxTabs from "./InboxTabs";
import InboxReplyItem from "./components/InboxReplyItem";
import {
  useInboxReplies,
  useInboxStatus,
} from "../../../stores/inbox/inboxStore";

function InboxScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const theme = useTheme();
  const inbox = useInbox();
  const replies = useInboxReplies();
  const status = useInboxStatus();

  useFocusEffect(
    useCallback(() => {
      inbox.doLoad();
    }, [])
  );

  useEffect(() => {
    navigation.setOptions({
      // TODO Handle
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <HeaderIconButton
          icon={<SFIcon icon="envelope.open" size={14} />}
          onPress={inbox.doReadAll}
        />
      ),
    });
  }, []);

  const replyItem = ({ item }: { item: ILemmyComment }) => (
    <InboxReplyItem
      commentId={item.comment.comment.id}
      unread={inbox.topSelected === "unread"}
      onPress={inbox.onCommentReplyPress}
    />
  );

  const onUnreadPress = () => {
    inbox.setTopSelected("unread");
  };

  const onAllPress = () => {
    inbox.setTopSelected("all");
  };

  const onRepliesPress = () => {
    inbox.setBottomSelected("replies");
  };

  const items = useMemo(() => {
    if (inbox.topSelected === "all") return replies;
    return replies.filter(
      (r) => (r.comment as CommentReplyView).comment_reply.read === false
    );
  }, [inbox.topSelected, replies]);

  const header = (
    <InboxTabs
      onUnreadPress={onUnreadPress}
      onAllPress={onAllPress}
      onRepliesPress={onRepliesPress}
      topSelected={inbox.topSelected}
      bottomSelected={inbox.bottomSelected}
    />
  );

  const empty = (!status.loading && status.error && (
    <LoadingErrorView onRetryPress={inbox.doLoad} />
  )) || (
    <VStack p={4} alignItems="center" justifyContent="center">
      <NoResultView type="inbox" />
    </VStack>
  );

  if ((status.loading && replies.length < 1) || inbox.inboxLoading) {
    return <LoadingView />;
  }

  return (
    <VStack flex={1} backgroundColor={theme.colors.app.bg}>
      <FlashList
        renderItem={replyItem}
        data={items}
        estimatedItemSize={100}
        refreshControl={
          <RefreshControl
            refreshing={status.refreshing}
            onRefresh={inbox.doLoad}
          />
        }
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
      />
    </VStack>
  );
}

export default InboxScreen;
