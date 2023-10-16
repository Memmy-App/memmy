import React, { useCallback, useMemo } from 'react';
import { CommunityView } from 'lemmy-js-client';
import { Pressable } from 'react-native';
import VStack from '@components/Common/Stack/VStack';
import HStack from '@components/Common/Stack/HStack';
import { Image } from 'expo-image';
import { ChevronRight, Globe, StickyNote, User } from '@tamagui/lucide-icons';
import { H5, Text } from 'tamagui';
import P1 from '@components/Common/Text/P1';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createFullName } from '@helpers/text';
import { getBaseUrl } from '@helpers/links';

interface IProps {
  view: CommunityView;
}

function CommunitySearchResult({ view }: IProps): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const name = useMemo(
    () =>
      createFullName(view.community.name, getBaseUrl(view.community.actor_id)),
    [view],
  );

  const onPress = useCallback(() => {
    navigation.push('Community', {
      name,
      communityId: view.community.id,
    });
  }, [view, name]);

  return (
    <Pressable onPress={onPress}>
      <VStack
        space="$1"
        padding="$2.5"
        backgroundColor="$fg"
        marginVertical="$1.5"
      >
        <HStack space="$3" alignItems="center">
          {view.community.icon != null ? (
            <Image
              source={{ uri: view.community.icon }}
              style={{
                width: 35,
                height: 35,
                borderRadius: 25,
              }}
            />
          ) : (
            <Globe size={30} color="$accent" />
          )}

          <H5>{view.community.name}</H5>
          <ChevronRight
            size={24}
            color="$accent"
            style={{
              marginLeft: 'auto',
            }}
          />
        </HStack>
        <HStack>
          <P1 numberOfLines={2}>
            {view.community.description ?? 'No description'}
          </P1>
        </HStack>
        <HStack alignItems="center" space="$3">
          <HStack alignItems="center" space="$2" justifyContent="center">
            <User size={20} color="$accent" />
            <Text>{view.counts.subscribers.toLocaleString()} Subscribers</Text>
          </HStack>
          <HStack alignItems="center" space="$2" justifyContent="center">
            <StickyNote size={20} color="$accent" />
            <Text>{view.counts.posts.toLocaleString()} Posts</Text>
          </HStack>
        </HStack>
      </VStack>
    </Pressable>
  );
}

export default React.memo(CommunitySearchResult);
