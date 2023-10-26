import React from 'react';
import { INavigationProps } from '@src/types';
import { useCommunityModerators } from '@src/state';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { CommunityModeratorView } from 'lemmy-js-client';
import { YStack } from 'tamagui';
import CommunityModeratorItem from '@components/Community/components/CommunityModeratorItem';

const renderItem = ({
  item,
}: ListRenderItemInfo<CommunityModeratorView>): React.JSX.Element => {
  return <CommunityModeratorItem view={item} />;
};

const keyExtractor = (item: CommunityModeratorView): string =>
  item.moderator.id.toString();

export default function CommunityModeratorListScreen({
  route,
}: INavigationProps): React.JSX.Element {
  const { communityId } = route.params;

  const moderators = useCommunityModerators(communityId);

  return (
    <YStack flex={1}>
      <FlashList<CommunityModeratorView>
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        data={moderators}
      />
    </YStack>
  );
}
