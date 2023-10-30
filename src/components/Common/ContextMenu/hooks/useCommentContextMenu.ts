import instance from '@src/Instance';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
import { useThemeColorScheme } from '@src/hooks';
import {
  setToast,
  useCommentCreatorActorId,
  useCommentPostId,
  useDataStore,
  usePostTitle,
} from '@src/state';
import { shareLink } from '@helpers/share/shareLink';
import * as Clipboard from 'expo-clipboard';

interface UseCommentContextMenu {
  reply: () => void;
  upvote: () => void;
  downvote: () => void;
  ban: () => void;
  edit: () => void;
  delet: () => void;
  remove: () => void;
  report: () => void;
  share: () => void;
  save: () => void;
  copy: () => Promise<void>;
}

export const useCommentContextMenu = (
  itemId: number,
): UseCommentContextMenu => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const colorScheme = useThemeColorScheme();

  const postId = useCommentPostId(itemId);
  const postTitle = usePostTitle(postId ?? 0);
  const commentLink = useCommentCreatorActorId(itemId);

  const share = (): void => {
    if (postTitle == null || commentLink == null) return;

    void shareLink({
      title: postTitle,
      link: commentLink,
    });
  };

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
    navigation.push('EditReply', { commentId: itemId });
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

  const report = (): void => {
    Alert.prompt(
      'Report Comment',
      'Enter a reason for your report.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Report',
          style: 'destructive',
          onPress: (msg) => {
            if (msg == null) {
              Alert.alert('Reason for report is required.');
              return;
            }

            void instance.reportComment(itemId, msg);
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

  const save = (): void => {
    void instance.saveComment(itemId);
  };

  const copy = async (): Promise<void> => {
    const comment = useDataStore.getState().comments.get(itemId);

    if (comment?.view.comment.content === undefined) {
      setToast({
        text: 'Error copying comment body.',
      });
      return;
    }

    try {
      const res = await Clipboard.setStringAsync(comment.view.comment.content);

      if (res) {
        setToast({
          text: 'Copied comment to clipboard!',
        });
      } else {
        setToast({
          text: 'Failed to copy comment to clipboard!',
        });
      }
    } catch (e: any) {
      setToast({
        text: 'Failed to copy comment to clipboard!',
      });
    }
  };

  return {
    share,
    reply,
    upvote,
    downvote,
    ban,
    edit,
    delet,
    remove,
    report,
    save,
    copy,
  };
};
