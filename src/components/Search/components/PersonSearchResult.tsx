import React, { useCallback, useMemo } from 'react';
import { PersonView } from 'lemmy-js-client';
import { Pressable } from 'react-native';
import { H5, Text, XStack, YStack } from 'tamagui';
import { Image } from 'expo-image';
import {
  ArrowUp,
  ChevronRight,
  MessageCircle,
  StickyNote,
  User,
} from '@tamagui/lucide-icons';
import P1 from '@components/Common/Text/P1';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createFullName } from '@helpers/text';
import { getBaseUrl } from '@helpers/links';

interface IProps {
  view: PersonView;
}

function PersonSearchResult({ view }: IProps): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const name = useMemo(
    () => createFullName(view.person.name, getBaseUrl(view.person.actor_id)),
    [view],
  );

  const onPress = useCallback(() => {
    navigation.push('Profile', {
      fullName: name,
    });
  }, [view, name]);

  return (
    <Pressable onPress={onPress}>
      <YStack
        space="$1"
        padding="$2.5"
        backgroundColor="$fg"
        marginVertical="$1.5"
      >
        <XStack space="$3" alignItems="center">
          {view.person.avatar != null ? (
            <Image
              source={{ uri: view.person.avatar }}
              style={{
                width: 35,
                height: 35,
                borderRadius: 25,
              }}
            />
          ) : (
            <User size={30} color="$accent" />
          )}

          <H5>{view.person.name}</H5>
          <ChevronRight
            size={24}
            color="$accent"
            style={{
              marginLeft: 'auto',
            }}
          />
        </XStack>
        {view.person.bio != null && view.person.bio !== '' && (
          <XStack>
            <P1 numberOfLines={2}>{view.person.bio}</P1>
          </XStack>
        )}
        <XStack alignItems="center" space="$3">
          <XStack alignItems="center" space="$2" justifyContent="center">
            <StickyNote size={20} color="$accent" />
            <Text>{view.counts.post_count.toLocaleString()}</Text>
          </XStack>
          <XStack alignItems="center" space="$2" justifyContent="center">
            <MessageCircle size={20} color="$accent" />
            <Text>{view.counts.comment_count.toLocaleString()}</Text>
          </XStack>
          <XStack alignItems="center" space="$2" justifyContent="center">
            <ArrowUp size={20} color="$accent" />
            <Text>
              {(
                view.counts.post_score + view.counts.comment_score
              ).toLocaleString()}
            </Text>
          </XStack>
        </XStack>
      </YStack>
    </Pressable>
  );
}

export default React.memo(PersonSearchResult);
