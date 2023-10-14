import React, { useCallback } from 'react';
import { usePostLink, usePostThumbnail } from '@src/state/post/postStore';
import { Separator, Text, View } from 'tamagui';
import { Image } from 'expo-image';
import HStack from '@components/Common/Stack/HStack';
import VStack from '@components/Common/Stack/VStack';
import { ChevronRight, Link } from '@tamagui/lucide-icons';
import { Pressable } from 'react-native';
import { openLink } from '@helpers/links';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const spinner = require('../../../../assets/spinner.svg');

interface IProps {
  itemId: number;
}

function PostLinkPreview({ itemId }: IProps): React.JSX.Element | null {
  const postLink = usePostLink(itemId);
  const postThumbnail = usePostThumbnail(itemId);

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
            <Image
              source={{ uri: postThumbnail }}
              style={{
                height: 120,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
              }}
              contentFit="cover"
              placeholder={spinner}
              placeholderContentFit="scale-down"
            />
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

export default React.memo(PostLinkPreview);
