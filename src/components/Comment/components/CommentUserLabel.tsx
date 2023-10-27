import React, { useCallback } from 'react';
import { useHideCommunityInComment, useSettingsStore } from '@src/state';
import { createName } from '@helpers/text';
import { Text, XStack, YStack } from 'tamagui';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import UserIcon from '@components/Common/Avatar/UserIcon';
import { getBaseUrl } from '@helpers/links';
import AdminBadge from '@components/Common/Badge/AdminBadge';
import OpBadge from '@components/Common/Badge/OpBadge';

interface IProps {
  userName: string | undefined;
  userCommunity: string | undefined;
  userIcon: string | undefined;
  isAdmin?: boolean;
  isOp?: boolean;
}

function CommentUserLabel({
  userName,
  userCommunity,
  userIcon,
  isAdmin,
  isOp,
}: IProps): React.JSX.Element {
  const showIcon = useSettingsStore((state) => state.showAvatarInFeed);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const hideCommunity = useHideCommunityInComment();

  const onPress = useCallback((): void => {
    navigation.push('Profile', {
      fullName: createName(userName, userCommunity, true),
    });
  }, [userName]);

  return (
    <XStack space="$2" alignItems="center" onPress={onPress} hitSlop={5}>
      {showIcon && <UserIcon userIcon={userIcon} />}
      <YStack>
        <XStack alignItems="center" space="$2">
          <Text fontSize="$2" color="$secondary" numberOfLines={1}>
            {userName}
          </Text>
          {isAdmin === true && <AdminBadge />}
          {isOp === true && <OpBadge />}
        </XStack>

        {!hideCommunity && (
          <Text fontSize="$2" color="$secondary" numberOfLines={1}>
            {getBaseUrl(userCommunity)}
          </Text>
        )}
      </YStack>
    </XStack>
  );
}

export default React.memo(CommentUserLabel);
