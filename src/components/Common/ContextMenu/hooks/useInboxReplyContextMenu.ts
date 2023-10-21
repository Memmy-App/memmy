import instance from '@src/Instance';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
import { useThemeColorScheme } from '@src/hooks';
import { likeReply } from '@src/state/inbox/actions';

interface UseCommentContextMenu {
  reply: () => void;
  upvote: () => void;
  downvote: () => void;
  report: () => void;
  read: () => void;
}

export const useInboxReplyContextMenu = (
  replyId: number,
  commentId: number,
  type: 'reply' | 'mention',
): UseCommentContextMenu => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const colorScheme = useThemeColorScheme();

  const reply = (): void => {
    navigation.push('Reply', {
      commentId,
      replyId: type === 'reply' ? replyId : undefined,
      mentionId: type === 'mention' ? replyId : undefined,
    });
  };

  const upvote = (): void => {
    likeReply(replyId, 1, type);
  };

  const downvote = (): void => {
    likeReply(replyId, -1, type);
  };

  const read = (): void => {
    if (type === 'reply') {
      void instance.markReplyRead(replyId);
    } else {
      void instance.markMentionRead(replyId);
    }
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

            void instance.reportComment(commentId, msg);
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
    report,
    read,
  };
};
