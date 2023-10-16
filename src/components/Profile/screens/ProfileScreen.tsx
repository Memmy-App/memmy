import React, { useCallback } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProfileScreen } from '@components/Profile/hooks/useProfileScreen';
import ProfileTopTabs from '@components/Profile/components/Tabs/ProfileTopTabs';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

interface IProfileScreenContext {
  profileId: number;
  isLoading: boolean;
  isError: boolean;

  onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const ProfileScreenContext = React.createContext<IProfileScreenContext>({
  profileId: -1,
  isLoading: true,
  isError: false,
  onScroll: () => {},
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

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    console.log(e.nativeEvent);
  }, []);

  return (
    <ProfileScreenContext.Provider
      value={{
        profileId: profileScreen.profileId,
        isLoading: profileScreen.isLoading,
        isError: profileScreen.isError,
        onScroll,
      }}
    >
      <ProfileTopTabs />
    </ProfileScreenContext.Provider>
  );
}
