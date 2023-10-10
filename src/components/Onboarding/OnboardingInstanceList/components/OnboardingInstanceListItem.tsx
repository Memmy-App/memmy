import React from 'react';
import { GetSiteResponse } from 'lemmy-js-client';
import { H5, Spacer, Text } from 'tamagui';
import { Image } from 'expo-image';
import HStack from '@components/Common/Stack/HStack';
import VStack from '@components/Common/Stack/VStack';
import { ChevronRight, Globe, StickyNote, User } from '@tamagui/lucide-icons';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import P1 from '@components/Common/Text/P1';

interface IProps {
  item: GetSiteResponse;
}

function OnboardingInstanceListItem({ item }: IProps): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const onPress = (): void => {
    navigation.navigate('CreateAccount', {
      instance: item.site_view.site.actor_id,
    });
  };

  return (
    <Pressable
      onPress={onPress}
    >
      <VStack
        space="$2"
        padding="$2.5"
        borderRadius={10}
        backgroundColor="$fg"
        marginVertical="$2"
        marginHorizontal="$3"
      >
        <HStack
          space="$3"
          alignItems="center"
        >
          {
            (item.site_view.site.icon != null)
              ? (
              <Image
                source={{ uri: item.site_view.site.icon }}
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 25,
                }}
              />
                )
              : (
              <Globe size={30} color="$accent" />
                )
          }

          <H5>{item.site_view.site.name}</H5>
          <ChevronRight size={24} color="$accent" style={{
            marginLeft: 'auto',
          }}/>
        </HStack>
        <HStack>
          <P1>
            {item.site_view.site.description ?? 'No description'}
          </P1>
        </HStack>
        <HStack
          alignItems="center"
          space="$1"
        >
          <User size={20} color="$accent" />
          <Text>{item.site_view.counts.users} Users</Text>
          <Spacer />
          <StickyNote size={20} color="$accent" />
          <Text>{item.site_view.counts.posts} Posts</Text>
        </HStack>
      </VStack>
    </Pressable>

  );
}

export default React.memo(OnboardingInstanceListItem);
