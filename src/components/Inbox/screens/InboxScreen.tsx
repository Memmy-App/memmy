import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTheme, View, XStack } from 'tamagui';
import Animated, { FadeIn } from 'react-native-reanimated';
import TopTabs from '@components/Common/TopTabs/TopTabs';
import PagerView from 'react-native-pager-view';
import { StyleSheet } from 'react-native';
import InboxRepliesTab from '@components/Inbox/components/InboxRepliesTab';
import InboxMentionsTab from '@components/Inbox/components/InboxMentionsTab';
import { INavigationProps } from '@src/types';
import { Mail, MailCheck, MailOpen } from '@tamagui/lucide-icons';

export default function InboxScreen({
  navigation,
}: INavigationProps): React.JSX.Element {
  const theme = useTheme();

  const pagerViewRef = useRef<PagerView>();

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [unreadOnly, setUnreadOnly] = useState(true);

  const headerTitle = useMemo(() => {
    let label;

    switch (selectedTab) {
      case 0:
        label = 'Replies';
        break;
      case 1:
        label = 'Mentions';
        break;
      case 2:
        label = 'Messages';
        break;
    }

    if (unreadOnly) {
      label += ' - Unread';
    } else {
      label += ' - All';
    }

    return label;
  }, [selectedTab, unreadOnly]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <XStack space="$4">
          <MailCheck onPress={onMarkAllReadPress} color={theme.accent.val} />
          {unreadOnly ? (
            <Mail
              onPress={() => {
                setUnreadOnly(false);
              }}
              color={theme.accent.val}
            />
          ) : (
            <MailOpen
              onPress={() => {
                setUnreadOnly(true);
              }}
              color={theme.accent.val}
            />
          )}
        </XStack>
      ),
      headerTitle,
    });
  }, [theme, unreadOnly, headerTitle]);

  const onTabChange = useCallback((index: number) => {
    setSelectedTab(index);
    pagerViewRef.current?.setPage(index);
  }, []);

  const onMarkAllReadPress = useCallback(() => {}, []);

  return (
    <Animated.View style={styles.container} entering={FadeIn}>
      <TopTabs
        onChange={onTabChange}
        items={['Comments', 'Mentions', 'Messages']}
        selectedIndex={selectedTab}
      />
      <PagerView
        style={styles.container}
        scrollEnabled={false}
        // @ts-expect-error valid
        ref={pagerViewRef}
        initialPage={0}
      >
        <View key={0} flex={1}>
          <InboxRepliesTab selected={selectedTab} unreadOnly={unreadOnly} />
        </View>
        <View key={1} flex={1}>
          <InboxMentionsTab selected={selectedTab} unreadOnly={false} />
        </View>
        <View key={2} flex={1}></View>
      </PagerView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
