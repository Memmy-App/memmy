import React, { useEffect } from "react";
import { Text, useTheme, VStack } from "native-base";
import { FlashList } from "@shopify/flash-list";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { IconMailOpened } from "tabler-icons-react-native";
import useInbox from "../../hooks/inbox/useInbox";
import LoadingErrorView from "../../ui/Loading/LoadingErrorView";
import ILemmyComment from "../../../lemmy/types/ILemmyComment";
import LoadingModalTransparent from "../../ui/Loading/LoadingModalTransparent";
import InboxTabs from "./InboxTabs";
import LoadingView from "../../ui/Loading/LoadingView";
import HeaderIconButton from "../../ui/buttons/HeaderIconButton";
import InboxReplyItem from "../../ui/inbox/InboxReplyItem";
import RefreshControl from "../../ui/common/RefreshControl";

function InboxScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const theme = useTheme();
  const inbox = useInbox();

  useEffect(() => {
    navigation.setOptions({
      // TODO Handle
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <HeaderIconButton
          icon={<IconMailOpened size={24} color={theme.colors.app.accent} />}
          onPress={inbox.doReadAll}
        />
      ),
    });
  }, []);

  const onRefresh = () => {
    inbox.doLoad(true);
  };

  const replyItem = ({ item }: { item: ILemmyComment }) => (
    <InboxReplyItem inbox={inbox} item={item} />
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
  const onMentionsPress = () => {};
  const onMessagesPress = () => {};

  const header = (
    <InboxTabs
      onUnreadPress={onUnreadPress}
      onAllPress={onAllPress}
      onRepliesPress={onRepliesPress}
      onMentionsPress={onMentionsPress}
      onMessagesPress={onMessagesPress}
      topSelected={inbox.topSelected}
      bottomSelected={inbox.bottomSelected}
    />
  );

  const empty = (inbox.loading && <LoadingView />) ||
    (inbox.error && (
      <LoadingErrorView onRetryPress={() => inbox.doLoad(true)} />
    )) || (
      <VStack p={4} alignItems="center" justifyContent="center">
        <Text fontStyle="italic">Nothing found in your inbox.</Text>
      </VStack>
    );

  return (
    <VStack flex={1} backgroundColor={theme.colors.app.bg}>
      <LoadingModalTransparent loading={inbox.loading} />
      <FlashList
        renderItem={replyItem}
        data={inbox.items}
        estimatedItemSize={100}
        refreshControl={
          <RefreshControl refreshing={inbox.refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
      />
    </VStack>
  );
}

export default InboxScreen;
