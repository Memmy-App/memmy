import instance from '@src/Instance';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
import { useThemeColorScheme } from '@src/hooks';

interface UseCommentContextMenu {
  reply: () => void;
  upvote: () => void;
  downvote: () => void;
  ban: () => void;
  edit: () => void;
  delet: () => void;
  remove: () => void;
}

export const useCommentContextMenu = (
  itemId: number,
): UseCommentContextMenu => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const colorScheme = useThemeColorScheme();

  const reply = (): void => {
    navigation.push('Reply', {
      commentId: itemId,
    });
  };

  const upvote = (): void => {
    void instance.likeComment(itemId, 1);
  };

  const downvote = (): void => {
    void instance.likeComment(itemId, -1);
  };

  const ban = (): void => {
    navigation.push('BanFromCommunity', { commentId: itemId });
  };

  const edit = (): void => {
    navigation.push('Reply', { commentId: itemId, edit: true });
  };

  const delet = (): void => {
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            void instance.deleteComment(itemId);
          },
        },
      ],
      {
        cancelable: true,
        userInterfaceStyle: colorScheme,
      },
    );
  };

  const remove = (): void => {
    Alert.prompt(
      'Remove Comment',
      'Are you sure you want to remove this comment? You may enter an optional reason below.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: (msg) => {
            void instance.modRemoveComment({
              comment_id: itemId,
              reason: msg,
            });
          },
        },
      ],
      'plain-text',
      undefined,
      undefined,
      {
        cancelable: true,
        userInterfaceStyle: colorScheme,
      },
    );
  };

  return {
    reply,
    upvote,
    downvote,
    ban,
    edit,
    delet,
    remove,
  };
};
