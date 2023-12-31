import React, { useCallback, useMemo } from 'react';
import { useSettingsStore } from '@src/state';
import { Text, XStack } from 'tamagui';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createName } from '@helpers/text';
import UserIcon from '@components/Common/Avatar/UserIcon';
import AdminBadge from '@components/Common/Badge/AdminBadge';

interface IProps {
  userId?: number;
  userName?: string;
  userCommunity?: string;
  userIcon?: string;
  isAdmin?: boolean;
  isSelf?: boolean;
}

function PostUserLabel({
  userId,
  userName,
  userCommunity,
  userIcon,
  isAdmin,
  isSelf,
}: IProps): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const showAvatar = useSettingsStore((state) => state.showAvatarInFeed);

  const name = useMemo(
    () => createName(userName, userCommunity),
    [userName, userCommunity],
  );

  const onPress = useCallback((): void => {
    navigation.push('Profile', {
      personId: userId,
    });
  }, [name]);

  return (
    <XStack space="$2" alignItems="center" width="auto">
      {showAvatar && <UserIcon userIcon={userIcon} />}
      <Text color="$secondary" fontSize="$2" onPress={onPress} hitSlop={3}>
        {name}
      </Text>
      {isAdmin === true && <AdminBadge />}
      {isSelf === true && <AdminBadge />}
    </XStack>
  );
}

export default React.memo(PostUserLabel);
