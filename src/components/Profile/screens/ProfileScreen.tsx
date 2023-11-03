import React, { SetStateAction, useCallback, useRef, useState } from 'react';
import { useProfileScreen } from '@components/Profile/hooks/useProfileScreen';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  SharedValue,
  useSharedValue,
} from 'react-native-reanimated';
import ProfileHeader from '@components/Profile/components/ProfileHeader';
import PagerView from 'react-native-pager-view';
import ProfilePostsTab from '@components/Profile/components/Tabs/ProfilePostsTab';
import ProfileCommentsTab from '@components/Profile/components/Tabs/ProfileCommentsTab';
import ProfileAboutTab from '@components/Profile/components/Tabs/ProfileAboutTab';
import LoadingScreen from '@components/Common/Loading/LoadingScreen';
import LoadingOverlay from '@components/Common/Loading/LoadingOverlay';

interface IProfileScreenContext {
  profileId: number;
  isLoading: boolean;
  isError: boolean;
  isRefreshing: boolean;

  refresh: () => void;

  onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  contentOffsetY: SharedValue<number> | undefined;
  setPostLoading?: React.Dispatch<SetStateAction<boolean>>;

  selectedTab: number;
  setSelectedTab?: React.Dispatch<SetStateAction<number>>;

  pagerViewRef?: React.MutableRefObject<PagerView | undefined>;
}

const ProfileScreenContext = React.createContext<IProfileScreenContext>({
  profileId: -1,
  isLoading: true,
  isError: false,
  isRefreshing: false,
  onScroll: () => {},
  refresh: () => {},
  contentOffsetY: undefined,

  selectedTab: 0,
  setSelectedTab: undefined,
  pagerViewRef: undefined,
});

export const useProfileScreenContext = (): IProfileScreenContext =>
  React.useContext(ProfileScreenContext);

export default function ProfileScreen(): React.JSX.Element {
  const profileScreen = useProfileScreen();
  const contentOffsetY = useSharedValue(0);

  const [selectedTab, setSelectedTab] = useState(0);
  const [postLoading, setPostLoading] = useState(false);

  const pagerViewRef = useRef<PagerView>();

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    contentOffsetY.value =
      e.nativeEvent.contentOffset.y >= 0 ? e.nativeEvent.contentOffset.y : 0;
  }, []);

  if (profileScreen.isLoading && !profileScreen.isRefreshing) {
    return <LoadingScreen />;
  }

  return (
    <Animated.View style={{ flex: 1 }} entering={FadeIn}>
      <LoadingOverlay visible={postLoading} />
      <ProfileScreenContext.Provider
        value={{
          profileId: profileScreen.profileId,
          isLoading: profileScreen.isLoading,
          isError: profileScreen.isError,
          isRefreshing: profileScreen.isRefreshing,
          refresh: profileScreen.refresh,
          onScroll,
          contentOffsetY,
          setPostLoading,
          selectedTab,
          setSelectedTab,
          pagerViewRef,
        }}
      >
        <ProfileHeader />
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
          <View key={4} style={{ flex: 1 }}>
            <ProfileAboutTab />
          </View>
        </PagerView>
      </ProfileScreenContext.Provider>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pagerStyle: {
    flex: 1,
    zIndex: -1,
  },
});
