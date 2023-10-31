import instance from '@src/Instance';
import { setToast, useCommunityBlocked } from '@src/state';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface UseCommunityContextMenu {
  block: () => void;
  modLog: () => void;
  moderators: () => void;
  info: () => void;
}

export const useCommunityContextMenu = (
  itemId: number,
): UseCommunityContextMenu => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const blocked = useCommunityBlocked(itemId);

  const block = (): void => {
    try {
      void instance.blockCommunity({
        communityId: itemId,
        block: !blocked,
      });

      setToast({
        text: `Community ${blocked ? 'unblocked' : 'blocked'}!`,
      });
    } catch (e: any) {}
  };

  const modLog = (): void => {
    navigation.navigate('ModLog', {
      communityId: itemId,
    });
  };

  const moderators = (): void => {
    navigation.navigate('CommunityModerators', {
      communityId: itemId,
    });
  };

  const info = (): void => {
    navigation.navigate('CommunityInfo', {
      communityId: itemId,
    });
  };

  return {
    block,
    modLog,
    moderators,
    info,
  };
};
