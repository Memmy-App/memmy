import React, { useCallback, useRef, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProfileScreen } from '@components/Profile/hooks/useProfileScreen';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import { SharedValue, useSharedValue } from 'react-native-reanimated';
import ProfileHeader from '@components/Profile/components/ProfileHeader';
import PagerView from 'react-native-pager-view';
import ProfilePostsTab from '@components/Profile/components/Tabs/ProfilePostsTab';
import ProfileCommentsTab from '@components/Profile/components/Tabs/ProfileCommentsTab';
import ProfileAboutTab from '@components/Profile/components/Tabs/ProfileAboutTab';
import TopTabs from '@components/Common/TopTabs/TopTabs';

interface IProfileScreenContext {
  profileId: number;
  isLoading: boolean;
  isError: boolean;

  onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  contentOffsetY: SharedValue<number> | undefined;
}

const ProfileScreenContext = React.createContext<IProfileScreenContext>({
  profileId: -1,
  isLoading: true,
  isError: false,
  onScroll: () => {},
  contentOffsetY: undefined,
});

export const useProfileScreenContext = (): IProfileScreenContext =>
  React.useContext(ProfileScreenContext);

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

export default function ProfileScreen({
  navigation,
}: IProps): React.JSX.Element {
  const profileScreen = useProfileScreen();
  const contentOffsetY = useSharedValue(0);

  const [selectedTab, setSelectedTab] = useState(0);

  const pagerViewRef = useRef<PagerView>();

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    contentOffsetY.value =
      e.nativeEvent.contentOffset.y >= 0 ? e.nativeEvent.contentOffset.y : 0;

    console.log(contentOffsetY.value);
  }, []);

  const onTabChange = useCallback((index: number) => {
    setSelectedTab(index);
    pagerViewRef.current?.setPage(index);
  }, []);

  return (
    <ProfileScreenContext.Provider
      value={{
        profileId: profileScreen.profileId,
        isLoading: profileScreen.isLoading,
        isError: profileScreen.isError,
        onScroll,
        contentOffsetY,
      }}
    >
      <ProfileHeader />
      <TopTabs
        onChange={onTabChange}
        items={['Posts', 'Comments', 'About']}
        selectedIndex={selectedTab}
      />
      <PagerView
        style={styles.pagerStyle}
        scrollEnabled={false}
        // @ts-expect-error - this is valid
        ref={pagerViewRef}
      >
        <View key={0} style={{ flex: 1 }}>
          <ProfilePostsTab />
        </View>
        <View key={1} style={{ flex: 1 }}>
          <ProfileCommentsTab />
        </View>
        <View key={2} style={{ flex: 1 }}>
          <ProfileAboutTab />
        </View>
      </PagerView>
    </ProfileScreenContext.Provider>
  );
}

const styles = StyleSheet.create({
  pagerStyle: {
    flex: 1,
  },
});
