import React, { useMemo } from 'react';
import { useSettingsStore } from '@src/state/settings/settingsStore';
import HStack from '@components/Common/Stack/HStack';
import { Text } from 'tamagui';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createName } from '@helpers/text';
import UserIcon from '@components/Common/Avatar/UserIcon';

interface IProps {
  userName?: string;
  userCommunity?: string;
  userIcon?: string;
}

function PostUserLabel({
  userName,
  userCommunity,
  userIcon,
}: IProps): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const showIcon = useSettingsStore((state) => state.showAvatarInFeed);

  const name = useMemo(
    () => createName(userName, userCommunity),
    [userName, userCommunity],
  );

  const onPress = (): void => {
    navigation.navigate('User', {
      fullName: createName(userName, userCommunity, true),
    });
  };

  return (
    <Pressable onPress={onPress} hitSlop={5}>
      <HStack space="$2" alignItems="center">
        {showIcon && <UserIcon userIcon={userIcon} />}
        <Text color="$secondary" fontSize={13}>
          {name}
        </Text>
      </HStack>
    </Pressable>
  );
}

export default React.memo(PostUserLabel);
