import React, { useCallback, useMemo } from 'react';
import { useSettingsStore } from '@src/state';
import { createName } from '@helpers/text';
import { Text, XStack } from 'tamagui';
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
    navigation.push('Profile', {
      fullName: createName(userName, userCommunity, true),
    });
  }, [userName]);

  return (
    <XStack space="$2" alignItems="center" onPress={onPress} hitSlop={5}>
      {showIcon && <UserIcon userIcon={userIcon} />}
      <Text fontSize="$2" color="$secondary">
        {name}
      </Text>
    </XStack>
  );
}

export default React.memo(CommentUserLabel);
