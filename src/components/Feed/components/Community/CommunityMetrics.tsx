import React from 'react';
import { useCommunityAggregates } from '@src/state';
import HStack from '@components/Common/Stack/HStack';
import { MessageCircle, StickyNote, User } from '@tamagui/lucide-icons';
import { Text } from 'tamagui';

interface IProps {
  itemId: number;
}

function CommunityMetrics(props: IProps): React.JSX.Element {
  const communityAggregates = useCommunityAggregates(props.itemId);

  return (
    <HStack space="$2.5" alignItems="center">
      <HStack alignItems="center" space="$1.5">
        <User size={16} color="$secondary" />
        <Text fontSize="$2" color="$secondary">
          {communityAggregates?.subscribers}
        </Text>
      </HStack>
      <HStack alignItems="center" space="$1.5">
        <StickyNote size={16} color="$secondary" />
        <Text fontSize="$2" color="$secondary">
          {communityAggregates?.posts}
        </Text>
      </HStack>
      <HStack alignItems="center" space="$1.5">
        <MessageCircle size={16} color="$secondary" />
        <Text fontSize="$2" color="$secondary">
          {communityAggregates?.comments}
        </Text>
      </HStack>
    </HStack>
  );
}

export default React.memo(CommunityMetrics);
