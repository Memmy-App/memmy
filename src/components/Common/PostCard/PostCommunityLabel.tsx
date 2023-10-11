import React, { useMemo } from 'react';
import { useSettingsStore } from '@src/state/settings/settingsStore';
import HStack from '@components/Common/Stack/HStack';
import { Image } from 'expo-image';
import { Globe } from '@tamagui/lucide-icons';
import { Text } from 'tamagui';
import { IPostCommunityName } from '@src/state/post/postStore';
import { createName } from '@helpers/text';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface IProps {
  communityName: IPostCommunityName | undefined;
  communityIcon?: string;
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

function PostCommunityLabel({
  communityName,
  communityIcon,
}: IProps): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const showIcon = useSettingsStore((state) => state.showCommunityIconInFeed);
  const fullName = useMemo(
    () => createName(communityName?.community, communityName?.instance, true),
    [communityName],
  );

  const onPress = (): void => {
    navigation.navigate('Community', {
      fullName,
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
