import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme, View } from 'tamagui';
import Animated, { FadeIn } from 'react-native-reanimated';
import TopTabs from '@components/Common/TopTabs/TopTabs';
import PagerView from 'react-native-pager-view';
import { StyleSheet } from 'react-native';
import InboxRepliesTab from '@components/Inbox/components/InboxRepliesTab';
import InboxMentionsTab from '@components/Inbox/components/InboxMentionsTab';
import { INavigationProps } from '@src/types';
import { MailOpen } from '@tamagui/lucide-icons';

export default function InboxScreen({
  navigation,
}: INavigationProps): React.JSX.Element {
  const theme = useTheme();

  const pagerViewRef = useRef<PagerView>();

  const [selectedTab, setSelectedTab] = useState<number>(0);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <MailOpen onPress={onMarkAllReadPress} color={theme.accent.val} />
      ),
    });
  }, [theme]);

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
          <InboxRepliesTab selected={selectedTab} />
        </View>
        <View key={1} flex={1}>
          <InboxMentionsTab selected={selectedTab} />
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
