import React from 'react';
import { useSettingsStore } from '@src/state/settings/settingsStore';
import HStack from '@components/Common/Stack/HStack';
import { Image } from 'expo-image';
import { User } from '@tamagui/lucide-icons';
import { Text } from 'tamagui';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createName } from '@helpers/text';

interface IProps {
  userName?: string;
  userCommunity?: string;
  userIcon?: string;
}

interface ICommunityIconProps {
  userIcon?: string;
}

function UserIcon({ userIcon }: ICommunityIconProps): React.JSX.Element {
  if (userIcon == null) {
    return <User size={14} color="$accent" />;
  }

  return (
    <Image
      source={{ uri: userIcon }}
      style={{
        width: 16,
        height: 16,
        borderRadius: 25,
      }}
    />
  );
}

function PostUserLabel({
  userName,
  userCommunity,
  userIcon,
}: IProps): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const showIcon = useSettingsStore((state) => state.showAvatarInFeed);

  const name = createName(userName, userCommunity);

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
