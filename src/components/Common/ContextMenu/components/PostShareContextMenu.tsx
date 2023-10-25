import React, { useCallback, useMemo } from 'react';
import { AppContextMenuButton } from '@components/Common/ContextMenu/AppContextMenuButton';
import { IContextMenuOption } from '@src/types';
import {
  usePostActorId,
  usePostLink,
  usePostLinkType,
  usePostTitle,
} from '@src/state';
import { OnPressMenuItemEventObject } from 'react-native-ios-context-menu';
import { shareLink } from '@helpers/share/shareLink';

interface IProps {
  itemId: number;
  children: React.ReactNode;
}

function PostShareContextMenu({ itemId, children }: IProps): React.JSX.Element {
  const linkType = usePostLinkType(itemId);
  const postLink = usePostLink(itemId);
  const postTitle = usePostTitle(itemId);
  const postActorId = usePostActorId(itemId);

  const options = useMemo(
    (): IContextMenuOption[] => [
      {
        key: 'post',
        title: 'Share Post',
        icon: 'note',
      },
      ...(postLink != null && linkType === 'image'
        ? [
            {
              key: 'image',
              title: 'Share Image',
              icon: 'photo',
            },
          ]
        : []),
      ...(postLink != null && linkType !== 'image'
        ? [
            {
              key: 'link',
              title: 'Share Link',
              icon: 'link',
            },
          ]
        : []),
    ],
    [itemId],
  );

  const onPressMenuItem = useCallback(
    (e: OnPressMenuItemEventObject) => {
      switch (e.nativeEvent.actionKey) {
        case 'post': {
          void shareLink({
            title: postTitle,
            link: postActorId!,
          });
          break;
        }
        default: {
          void shareLink({
            title: postTitle,
            link: postLink!,
            isImage: e.nativeEvent.actionKey === 'image',
          });
          break;
        }
      }
    },
    [itemId],
  );

  return (
    <AppContextMenuButton options={options} onPressMenuItem={onPressMenuItem}>
      {children}
    </AppContextMenuButton>
  );
}

export default React.memo(PostShareContextMenu);
