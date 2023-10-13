import React, { useMemo } from 'react';
import {
  useCommunityActorId,
  useCommunityDisplayName,
  useCommunityName,
} from '@src/state/community/communityStore';
import { createFullName } from '@helpers/text';
import VStack from '@components/Common/Stack/VStack';
import { Text } from 'tamagui';
import { getBaseUrl } from '@helpers/links';

interface IProps {
  itemId: number;
}

function CommunityTitle({ itemId }: IProps): React.JSX.Element {
  const communityDisplayName = useCommunityDisplayName(itemId);
  const communityName = useCommunityName(itemId);
  const communityActorId = useCommunityActorId(itemId);

  const communityFullName = useMemo(
    () => createFullName(communityName, getBaseUrl(communityActorId)),
    [communityName, communityActorId],
  );

  return (
    <VStack>
      <Text
        numberOfLines={1}
        wordWrap="break-word"
        fontSize="$7"
        fontWeight="bold"
      >
        {communityDisplayName}
      </Text>
      <Text fontSize="$3">{communityFullName}</Text>
    </VStack>
  );
}

export default React.memo(CommunityTitle);
