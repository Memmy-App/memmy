import React from 'react';
import {
  useBlurNsfw,
  usePostCommunityNsfw,
  usePostLink,
  usePostLinkType,
  usePostNsfw,
  usePostThumbnail,
  usePostTitle,
} from '@src/state';
import { YStack } from 'tamagui';
import ViewerImage from '@components/Common/ImageViewer/ViewerImage';
import { Link } from '@tamagui/lucide-icons';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

interface IProps {
  itemId: number;
}

function CompactFeedItemThumbnail({ itemId }: IProps): React.JSX.Element {
  const blurNsfw = useBlurNsfw();

  const postLink = usePostLink(itemId);
  const postLinkType = usePostLinkType(itemId);
  const postNsfw = usePostNsfw(itemId);
  const postCommunityNsfw = usePostCommunityNsfw(itemId);
  const postTitle = usePostTitle(itemId);
  const postThumbnail = usePostThumbnail(itemId);

  if (postLinkType === 'image') {
    return (
      <YStack justifyContent="center" borderRadius="$2">
        <ViewerImage
          source={postLink!}
          blurRadius={(postNsfw || postCommunityNsfw) && blurNsfw ? 90 : 0}
          title={postTitle}
          overrideDimensions
          height={65}
          width={65}
          borderRadius={10}
        />
      </YStack>
    );
  }

  return (
    <YStack
      backgroundColor="$bg"
      justifyContent="center"
      borderRadius="$2"
      height={65}
      width={65}
    >
      <YStack
        position="absolute"
        zIndex={1}
        alignItems="center"
        justifyContent="center"
        width={65}
        height={65}
        backgroundColor="rgba(0,0,0,0.3)"
        borderRadius="$2"
      >
        <Link color="white" />
      </YStack>
      {postThumbnail != null && (
        <YStack zIndex={-1} alignItems="center" justifyContent="center">
          <Image source={postThumbnail} style={styles.image} />
        </YStack>
      )}
    </YStack>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 65,
    width: 65,
    borderRadius: 10,
  },
});

export default React.memo(CompactFeedItemThumbnail);
