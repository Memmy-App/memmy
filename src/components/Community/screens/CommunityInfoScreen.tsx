import React from 'react';
import { INavigationProps } from '@src/types';
import { ScrollView, YStack } from 'tamagui';
import { useCommunityDescription } from '@src/state';
import Markdown from '@components/Common/Markdown/Markdown';

export default function CommunityInfoScreen({
  route,
}: INavigationProps): React.JSX.Element {
  const { communityId } = route.params;
  const communityDescription = useCommunityDescription(communityId);

  return (
    <ScrollView flex={1}>
      <YStack py="$5" px="$3" pb="$10">
        <Markdown>
          {communityDescription ?? 'This community has no description.'}
        </Markdown>
      </YStack>
    </ScrollView>
  );
}
