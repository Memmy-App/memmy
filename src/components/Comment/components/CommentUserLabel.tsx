import React, { useCallback, useMemo } from 'react';
import { useSettingsStore } from '@src/state/settings/settingsStore';
import { createName } from '@helpers/text';
import { Pressable } from 'react-native';
import HStack from '@components/Common/Stack/HStack';
import { Text } from 'tamagui';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import UserIcon from '@components/Common/Avatar/UserIcon';

interface IProps {
  userName: string | undefined;
  userCommunity: string | undefined;
  userIcon: string | undefined;
}

function CommentUserLabel({
  userName,
  userCommunity,
  userIcon,
}: IProps): React.JSX.Element {
  const showIcon = useSettingsStore((state) => state.showAvatarInFeed);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const name = useMemo(
    () => createName(userName, userCommunity),
    [userName, userCommunity],
  );

  const onPress = useCallback((): void => {
    navigation.navigate('User', {
      fullName: createName(userName, userCommunity, true),
    });
  }, [userName]);

  return (
    <Pressable onPress={onPress} hitSlop={5}>
      <HStack space="$2" alignItems="center">
        {showIcon && <UserIcon userIcon={userIcon} />}
        <Text color="$secondary" fontSize={14}>
          {userName}
        </Text>
      </HStack>
    </Pressable>
  );
}

export default React.memo(CommentUserLabel);
