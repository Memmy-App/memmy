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
    // TODO Going to need to implement some nice logic for these. Lots of different types
    // {
    //   key: 'modLog',
    //   title: 'Mod Log',
    //   icon: 'checkmark.shield',
    // },
    {
      key: 'block',
      title: blocked ? 'Unblock' : 'Block',
      icon: 'hand.raised',
      destructive: true,
    },
  ];
};
