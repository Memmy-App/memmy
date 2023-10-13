import React, { useMemo } from 'react';
import { useSettingsStore } from '@src/state/settings/settingsStore';
import HStack from '@components/Common/Stack/HStack';
import { Image } from 'expo-image';
import { Globe } from '@tamagui/lucide-icons';
import { Text } from 'tamagui';
import { createName } from '@helpers/text';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  usePostCommunityActorId,
  usePostCommunityIcon,
  usePostCommunityId,
  usePostCommunityName,
} from '@src/state/post/postStore';

interface IProps {
  itemId: number;
}

interface ICommunityIconProps {
  communityIcon?: string;
}

function CommunityIcon({
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

function PostCommunityLabel({ itemId }: IProps): React.JSX.Element {
  const communityName = usePostCommunityName(itemId);
  const actorId = usePostCommunityActorId(itemId);
  const communityIcon = usePostCommunityIcon(itemId);
  const communityId = usePostCommunityId(itemId);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const showIcon = useSettingsStore((state) => state.showCommunityIconInFeed);
  const fullName = useMemo(
    () => createName(communityName, actorId, true),
    [communityName],
  );

  const onPress = (): void => {
    navigation.navigate('Community', {
      name: fullName,
      id: communityId,
    });
  };

  return (
    <Pressable onPress={onPress} hitSlop={5}>
      <HStack space="$2" alignItems="center">
        {showIcon && <CommunityIcon communityIcon={communityIcon} />}
        <Text color="$secondary" fontSize={13}>
          {fullName}
        </Text>
      </HStack>
    </Pressable>
  );
}

export default React.memo(PostCommunityLabel);
