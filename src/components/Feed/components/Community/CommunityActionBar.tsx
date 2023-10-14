import React, { useCallback, useMemo, useState } from 'react';
import { useCommunitySubscribed } from '@src/state/community/communityStore';
import instance from '@api/Instance';
import { isSubscribed } from '@helpers/lemmy';
import HStack from '@components/Common/Stack/HStack';
import ButtonOne from '@components/Common/Button/ButtonOne';
import { Share, Star } from '@tamagui/lucide-icons';

interface IProps {
  itemId: number;
}

function CommunityActionBar({ itemId }: IProps): React.JSX.Element {
  const communitySubscribed = useCommunitySubscribed(itemId);

  const [subscribing, setSubscribing] = useState<boolean>(false);

  const subscribed = useMemo(
    () => isSubscribed(communitySubscribed),
    [communitySubscribed],
  );

  const onSubscribePress = useCallback((): void => {
    setSubscribing(true);

    void instance.subscribeCommunity(itemId, !subscribed).then(() => {
      setSubscribing(false);
    });
  }, [itemId, subscribed]);

  const onSharePress = useCallback((): void => {}, [itemId]);

  return (
    <HStack
      width="100%"
      flex={1}
      alignItems="center"
      justifyContent="center"
      space="$3"
    >
      <ButtonOne
        onPress={onSubscribePress}
        disabled={subscribing}
        label={subscribed ? 'Subscribed' : 'Subscribe'}
        icon={Star}
      />
      <ButtonOne onPress={onSharePress} label="Share" icon={Share} />
    </HStack>
  );
}

export default React.memo(CommunityActionBar);
