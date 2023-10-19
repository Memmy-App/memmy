import React, { useCallback, useRef, useState } from 'react';
import { View } from 'tamagui';
import Animated, { FadeIn } from 'react-native-reanimated';
import TopTabs from '@components/Common/TopTabs/TopTabs';
import PagerView from 'react-native-pager-view';
import { StyleSheet } from 'react-native';
import InboxRepliesTab from '@components/Inbox/components/InboxRepliesTab';
import InboxMentionsTab from '@components/Inbox/components/InboxMentionsTab';

export default function InboxScreen(): React.JSX.Element {
  const pagerViewRef = useRef<PagerView>();

  const [selectedTab, setSelectedTab] = useState<number>(0);

  const onTabChange = useCallback((index: number) => {
    setSelectedTab(index);
    pagerViewRef.current?.setPage(index);
  }, []);

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
        <View key={0} style={styles.container}>
          <InboxRepliesTab selected={selectedTab} />
        </View>
        <View key={1} style={styles.container}>
          <InboxMentionsTab selected={selectedTab} />
        </View>
        <View key={2} style={styles.container}></View>
      </PagerView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
