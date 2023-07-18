import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { VStack, useTheme } from "native-base";
import React, { useCallback, useEffect } from "react";
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
          icon={<SFIcon icon="envelope.open" size={14} />}
          onPress={inbox.doReadAll}
        />
      ),
    });
  }, []);

  const onRefresh = useCallback(() => {
    inbox.doLoad(true);
  }, []);

  const replyItem = ({ item }: { item: ILemmyComment }) => (
    <InboxReplyItem inbox={inbox} item={item} />
  );

  const onUnreadPress = useCallback(() => {
    inbox.setTopSelected("unread");
  }, []);

  const onAllPress = useCallback(() => {
    inbox.setTopSelected("all");
  }, []);

  const onRepliesPress = useCallback(() => {
    inbox.setBottomSelected("replies");
  }, []);

  const header = (
    <InboxTabs
      onUnreadPress={onUnreadPress}
      onAllPress={onAllPress}
      onRepliesPress={onRepliesPress}
      topSelected={inbox.topSelected}
      bottomSelected={inbox.bottomSelected}
    />
  );

  const empty = (inbox.loading && <LoadingView />) ||
    (inbox.error && (
      <LoadingErrorView onRetryPress={() => inbox.doLoad(true)} />
    )) || (
      <VStack p={4} alignItems="center" justifyContent="center">
        <NoResultView type="inbox" />
      </VStack>
    );

  return (
    <VStack flex={1} backgroundColor={theme.colors.app.bg}>
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
