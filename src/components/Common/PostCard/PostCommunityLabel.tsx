import React, { useCallback, useMemo } from 'react';
import {
  usePostCommunityActorId,
  usePostCommunityIcon,
  usePostCommunityId,
  usePostCommunityName,
  useSettingsStore,
} from '@src/state';
import { Image } from 'expo-image';
import { Globe } from '@tamagui/lucide-icons';
import { Text, XStack } from 'tamagui';
import { createName } from '@helpers/text';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface IProps {
  itemId: number;
  pressable?: boolean;
}

interface ICommunityIconProps {
  communityIcon?: string;
}

function CommunityIconInner({
  communityIcon,
}: ICommunityIconProps): React.JSX.Element {
  if (communityIcon == null) {
    return <Globe size={14} color="$accent" />;
  }

  return (
    <Image
      source={{ uri: communityIcon }}
      style={{
        width: 16,
        height: 16,
        borderRadius: 25,
      }}
    />
  );
}

const CommunityIcon = React.memo(CommunityIconInner);

function PostCommunityLabel({
  itemId,
  pressable = true,
}: IProps): React.JSX.Element {
  const communityName = usePostCommunityName(itemId);
  const actorId = usePostCommunityActorId(itemId);
  const communityIcon = usePostCommunityIcon(itemId);
  const communityId = usePostCommunityId(itemId);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const showIcon = useSettingsStore((state) => state.showCommunityIconInFeed);
  const fullName = useMemo(
    () => createName(communityName, actorId, true),
    [communityName, actorId],
  );

  const onPress = useCallback((): void => {
    navigation.push('Community', {
      communityName: fullName,
      communityId,
    });
  }, [communityId]);

  return (
    <XStack
      space="$2"
      alignItems="center"
      onPress={pressable ? onPress : undefined}
      hitSlop={3}
    >
      {showIcon && <CommunityIcon communityIcon={communityIcon} />}
      <Text color="$secondary" fontSize="$2">
        {fullName}
      </Text>
    </XStack>
  );
}

export default React.memo(PostCommunityLabel);
