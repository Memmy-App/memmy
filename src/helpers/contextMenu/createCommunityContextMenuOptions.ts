import { IContextMenuOptions } from '@src/types';

interface CreateCommunityContextMenuOptionsParams {
  blocked: boolean;
  moderates: boolean;
}

export const createCommunityContextMenuOptions = ({
  blocked,
  moderates,
}: CreateCommunityContextMenuOptionsParams): IContextMenuOptions<any> => {
  return [
    {
      key: 'info',
      title: 'Info',
      icon: 'info.circle',
    },
    {
      key: 'moderators',
      title: 'Moderators',
      icon: 'person.badge.shield.checkmark',
    },
    {
      key: 'modLog',
      title: 'Mod Log',
      icon: 'checkmark.shield',
    },
    {
      key: 'block',
      title: blocked ? 'Unblock' : 'Block',
      icon: 'hand.raised',
      destructive: true,
    },
  ];
};
