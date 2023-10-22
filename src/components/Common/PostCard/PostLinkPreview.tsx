import React, { useCallback, useState } from 'react';
import {
  useMouseLoadingIcon,
  usePostCommunityNsfw,
  usePostLink,
  usePostNsfw,
  usePostThumbnail,
} from '@src/state';
import {
  Separator,
  Spinner,
  Text,
  useTheme,
  View,
  XStack,
  YStack,
} from 'tamagui';
import { Image } from 'expo-image';
import { ChevronRight, Link } from '@tamagui/lucide-icons';
import { Pressable, StyleSheet } from 'react-native';
import { openLink } from '@helpers/links';
import LoadingAnimation from '@components/Common/Loading/LoadingAnimation';

interface IProps {
  itemId: number;
}

function PostLinkPreview({ itemId }: IProps): React.JSX.Element | null {
  const theme = useTheme();

  const mouse = useMouseLoadingIcon();

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
    openLink(postLink, theme.navBarBg.val);
  }, [itemId, theme]);

  return (
    <Pressable onPress={onPress}>
      <View my="$3" mx="$5" backgroundColor="$bg" borderRadius={10}>
        <YStack space="$2">
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
            <XStack height={113} alignItems="center" justifyContent="center">
              {mouse ? (
                <LoadingAnimation size="small" />
              ) : (
                <Spinner color="$accent" size="large" />
              )}
            </XStack>
          )}
          <XStack
            alignItems="center"
            space="$2"
            width="100%"
            px="$3"
            pb="$2"
            pt={postThumbnail == null ? '$2' : undefined}
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
          </XStack>
        </YStack>
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
