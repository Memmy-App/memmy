import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useThemeColorScheme } from '@src/hooks';
import instance from '@src/Instance';
import {
  setToast,
  usePostActorId,
  usePostBody,
  usePostCommunityId,
  usePostCreatorId,
  usePostLink,
  usePostTitle,
} from '@src/state';
import { Alert } from 'react-native';
import { CheckCircle } from '@tamagui/lucide-icons';
import { shareLink } from '@helpers/share/shareLink';
import { copyImageToClipboard, saveImage } from '@helpers/image';
import * as Clipboard from 'expo-clipboard';

interface UsePostContextMenu {
  reply: () => void;
  upvote: () => void;
  downvote: () => void;
  ban: () => void;
  edit: () => void;
  delet: () => void;
  remove: () => void;
  report: () => void;
  share: () => void;
  savePostImage: () => void;
  copyPostImage: () => void;
  shareUrl: (isImage: boolean) => void;
  copyText: () => void;
  blockCreator: () => Promise<void>;
  blockCommunity: () => Promise<void>;
}

export const usePostContextMenu = (itemId: number): UsePostContextMenu => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const communityId = usePostCommunityId(itemId);
  const postTitle = usePostTitle(itemId);
  const postActorId = usePostActorId(itemId);
  const postLink = usePostLink(itemId);
  const postBody = usePostBody(itemId);
  const postCreatorId = usePostCreatorId(itemId);

  const colorScheme = useThemeColorScheme();

  const share = (): void => {
    if (postTitle == null || postActorId == null) {
      return;
    }

    void shareLink({
      title: postTitle,
      link: postActorId,
    });
  };

  const savePostImage = (): void => {
    if (postLink == null) return;

    void saveImage(postLink);
  };

  const copyPostImage = (): void => {
    if (postLink == null) return;

    void copyImageToClipboard(postLink);
  };

  const shareUrl = (isImage: boolean): void => {
    if (postTitle == null || postLink == null) return;

    void shareLink({
      title: postTitle,
      link: postLink,
      isImage,
    });
  };

  const copyText = (): void => {
    if (postBody === undefined) {
      setToast({
        text: 'Error copying post body.',
      });
      return;
    }
    void Clipboard.setStringAsync(postBody);
  };

  const reply = (): void => {
    navigation.push('Reply', {
      postId: itemId,
    });
  };

  const upvote = (): void => {
    void instance.likePost({ postId: itemId, vote: 1 });
  };

  const downvote = (): void => {
    void instance.likePost({ postId: itemId, vote: -1 });
  };

  const ban = (): void => {
    navigation.push('BanFromCommunity', { postId: itemId });
  };

  const edit = (): void => {
    navigation.push('NewPost', {
      communityId,
      postId: itemId,
    });
  };

  const delet = (): void => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            void instance.deletePost({ postId: itemId }).then(() => {
              setToast({
                text: 'Post deleted successfully!',
                icon: CheckCircle,
              });
            });
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
      'Remove Post',
      'Are you sure you want to remove this post? You may enter an optional reason below.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: (msg) => {
            void instance.modRemovePost({
              post_id: itemId,
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
      'Report Post',
      'Enter a reason for your report.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Report',
          style: 'destructive',
          onPress: (reason) => {
            if (reason == null) {
              Alert.alert('Reason for report is required.');
              return;
            }

            void instance.reportPost({ postId: itemId, reason });
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

  const blockCreator = async (): Promise<void> => {
    if (postCreatorId == null) return;

    await instance.blockPerson({ personId: postCreatorId, block: true });

    setToast({
      text: 'User blocked successfully!',
    });
  };

  const blockCommunity = async (): Promise<void> => {
    if (communityId == null) return;

    await instance.blockCommunity({ communityId, block: true });

    setToast({
      text: 'Community blocked successfully!',
    });
  };

  return {
    share,
    shareUrl,
    savePostImage,
    reply,
    upvote,
    downvote,
    ban,
    edit,
    delet,
    remove,
    report,
    copyText,
    copyPostImage,
    blockCreator,
    blockCommunity,
  };
};
