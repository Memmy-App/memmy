import React, { useCallback } from 'react';
import { CommunityModeratorView } from 'lemmy-js-client';
import { Text, View, XStack, YStack } from 'tamagui';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/core';
import { Image } from 'expo-image';
import { ChevronRight, User } from '@tamagui/lucide-icons';
import { StyleSheet } from 'react-native';
import { getBaseUrl } from '@helpers/links';

interface IProps {
  view: CommunityModeratorView;
}

function CommunityModeratorItem({ view }: IProps): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const onPress = useCallback(() => {
    navigation.pop();
    navigation.push('Profile', {
      personId: view.moderator.id,
    });
  }, [view]);

  return (
    <XStack
      mx="$2"
      my="$2"
      px="$3"
      py="$2"
      space="$3"
      backgroundColor="$fg"
      borderRadius="$3"
      alignItems="center"
      onPress={onPress}
    >
      {view.moderator.avatar != null ? (
        <Image source={view.moderator.avatar} style={styles.avatar} />
      ) : (
        <User color="$accent" size={50} />
      )}
      <YStack space="$1">
        <Text fontSize="$4">{view.moderator.name}</Text>
        <Text fontSize="$2">{getBaseUrl(view.moderator.actor_id)}</Text>
      </YStack>
      <View marginLeft="auto">
        <ChevronRight color="$accent" size={30} />
      </View>
    </XStack>
  );
}

const styles = StyleSheet.create({
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 100,
  },
});

export default React.memo(CommunityModeratorItem);
