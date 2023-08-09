import { useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { Box, Divider, VStack } from "@src/components/common/Gluestack";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import { CommentReplyView } from "lemmy-js-client";
import React, { useCallback, useEffect, useMemo } from "react";
import useInbox from "../../../hooks/inbox/useInbox";
import {
  useInboxReplies,
  useInboxStatus,
} from "../../../stores/inbox/inboxStore";
import ILemmyComment from "../../../types/lemmy/ILemmyComment";
import HeaderIconButton from "../../common/Buttons/HeaderIconButton";
import LoadingErrorView from "../../common/Loading/LoadingErrorView";
import LoadingView from "../../common/Loading/LoadingView";
import NoResultView from "../../common/NoResultView";
import RefreshControl from "../../common/RefreshControl";
import SFIcon from "../../common/icons/SFIcon";
import InboxTabs from "./InboxTabs";
import InboxReplyItem from "./components/InboxReplyItem";

function InboxScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const theme = useThemeOptions();
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

  const replyItem = ({
    item,
    index,
  }: {
    item: ILemmyComment;
    index: number;
  }) => (
    <Box
      mx="$2"
      style={{
        paddingTop: 2,
        paddingHorizontal: 3,
        backgroundColor: theme.colors.fg,
        ...(index === 0
          ? { borderTopRightRadius: 10, borderTopLeftRadius: 10 }
          : {}),
        ...(index === items.length - 1 && {
          paddingBottom: 2,
          borderBottomRightRadius: 10,
          borderBottomLeftRadius: 10,
        }),
      }}
    >
      <InboxReplyItem
        commentId={item.comment.comment.id}
        unread={inbox.topSelected === "unread"}
      />
      {index !== items.length - 1 && <Divider bg={theme.colors.border} />}
    </Box>
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
    <VStack p="$4" alignItems="center" justifyContent="center">
      <NoResultView type="inbox" />
    </VStack>
  );

  if ((status.loading && replies.length < 1) || inbox.inboxLoading) {
    return <LoadingView />;
  }

  return (
    <VStack flex={1} backgroundColor={theme.colors.bg}>
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
