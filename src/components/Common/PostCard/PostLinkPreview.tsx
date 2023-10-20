import React, { useCallback, useState } from 'react';
import {
  usePostCommunityNsfw,
  usePostLink,
  usePostNsfw,
  usePostThumbnail,
} from '@src/state';
import { Separator, Text, View } from 'tamagui';
import { Image } from 'expo-image';
import HStack from '@components/Common/Stack/HStack';
import VStack from '@components/Common/Stack/VStack';
import { ChevronRight, Link } from '@tamagui/lucide-icons';
import { Pressable, StyleSheet } from 'react-native';
import { openLink } from '@helpers/links';
import LoadingAnimation from '@components/Common/Loading/LoadingAnimation';

interface IProps {
  itemId: number;
}

function PostLinkPreview({ itemId }: IProps): React.JSX.Element | null {
  const postLink = usePostLink(itemId);
  const postThumbnail = usePostThumbnail(itemId);
  const postNsfw = usePostNsfw(itemId);
  const postCommunityNsfw = usePostCommunityNsfw(itemId);

  const [thumbnailLoading, setThumbnailLoading] = useState(false);

  const onLoadStart = useCallback(() => {
    setThumbnailLoading(true);
  }, []);

  const onLoadEnd = useCallback(() => {
    setThumbnailLoading(false);
  }, []);

  if (postLink == null) return null;

  const onPress = useCallback(() => {
    openLink(postLink);
  }, [itemId]);

  return (
    <Pressable onPress={onPress}>
      <View
        marginVertical="$3"
        marginHorizontal="$5"
        backgroundColor="$bg"
        borderRadius={10}
      >
        <VStack space="$2">
          {postThumbnail != null && (
            <View
              style={styles.image}
              display={thumbnailLoading ? 'none' : 'block'}
            >
              <Image
                source={postThumbnail}
                style={styles.image}
                contentFit="cover"
                recyclingKey={postThumbnail}
                onLoadStart={onLoadStart}
                onLoadEnd={onLoadEnd}
                blurRadius={postNsfw || postCommunityNsfw ? 90 : 0}
              />
            </View>
          )}
          {thumbnailLoading && (
            <HStack
              style={styles.loading}
              alignItems="center"
              justifyContent="center"
            >
              <LoadingAnimation size="small" />
            </HStack>
          )}
          <HStack
            alignItems="center"
            space="$2"
            width="100%"
            paddingHorizontal="$3"
            paddingBottom="$2"
            paddingTop={postThumbnail == null ? '$2' : undefined}
          >
            <Link size={16} />
            <Separator
              vertical
              borderColor="$secondary"
              height={20}
              opacity={0.5}
            />
            <View justifyContent="center" flex={1}>
              <Text color="$secondary" numberOfLines={1}>
                {postLink}
              </Text>
            </View>
            <ChevronRight color="$secondary" />
          </HStack>
        </VStack>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 120,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },

  loading: {
    height: 113,
  },
});

export default React.memo(PostLinkPreview);
