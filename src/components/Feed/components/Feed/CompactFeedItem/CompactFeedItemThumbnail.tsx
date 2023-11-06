import React from 'react';
import { usePostLinkType, usePostThumbnail } from '@src/state';
import { YStack } from 'tamagui';
import { Link } from '@tamagui/lucide-icons';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import ViewerImageWrapper from '@components/Common/ImageViewer/ViewerImageWrapper';

interface IProps {
  itemId: number;
}

function CompactFeedItemThumbnail({ itemId }: IProps): React.JSX.Element {
  const postLinkType = usePostLinkType(itemId);
  const postThumbnail = usePostThumbnail(itemId);

  if (postLinkType === 'image') {
    return (
      <YStack justifyContent="center" borderRadius="$2">
        <ViewerImageWrapper itemId={itemId} type="compact" />
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
