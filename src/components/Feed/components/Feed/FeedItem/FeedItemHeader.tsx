import React, { useCallback } from 'react';
import { Text, View } from 'tamagui';
import { useSettingsStore } from '@src/state/settings/settingsStore';
import VStack from '@components/Common/Stack/VStack';
import HStack from '@components/Common/Stack/HStack';
import PostCommunityLabel from '@components/Common/PostCard/PostCommunityLabel';
import AnimatedIconButton from '@components/Common/Button/AnimatedIconButton';
import { CircleEllipsis } from '@tamagui/lucide-icons';
import { Alert } from 'react-native';
import { usePostTitle } from '@src/state/post/postStore';

interface IProps {
  itemId: number;
}

function FeedItemHeader({ itemId }: IProps): React.JSX.Element {
  const postTitle = usePostTitle(itemId);

  const fontSize = useSettingsStore((state) => state.fontSize);
  const fontWeight = useSettingsStore((state) => state.postTitleWeight);

  const onEllipsisPress = useCallback((): void => {
    Alert.alert('Hi!');
  }, [itemId]);

  return (
    <VStack paddingHorizontal="$3" space="$1.5">
      <HStack alignItems="center">
        <PostCommunityLabel itemId={itemId} />
        <View marginLeft="auto">
          <AnimatedIconButton
            icon={CircleEllipsis}
            iconSize={18}
            onPress={onEllipsisPress}
          />
        </View>
      </HStack>
      <Text fontSize={fontSize} fontWeight={fontWeight}>
        {postTitle}
      </Text>
    </VStack>
  );
}

export default React.memo(FeedItemHeader);
