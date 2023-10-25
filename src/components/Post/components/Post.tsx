import React, { useCallback, useState } from 'react';
import PostHeader from '@components/Post/components/PostHeader';
import PostContent from '@components/Post/components/PostContent';
import PostActionBar from '@components/Post/components/PostActionBar';
import PostFooter from '@components/Post/components/PostFooter';
import { Text, XStack, YStack } from 'tamagui';
import { useRoute } from '@react-navigation/core';
import { usePostScreenContext } from '@components/Post/screens/PostScreen';
import { LayoutAnimation } from 'react-native';

function Post(): React.JSX.Element {
  const { parentCommentId } = useRoute<any>().params;

  const postScreen = usePostScreenContext();

  const [showLoadAll, setShowLoadAll] = useState<boolean>(
    parentCommentId != null,
  );

  const onPress = useCallback(() => {
    postScreen.setPostCollapsed?.((prev) => !prev);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, []);

  const onLoadAllPress = useCallback(() => {
    setShowLoadAll(false);
    postScreen.refresh?.();
  }, []);

  return (
    <YStack backgroundColor="$fg" onPress={onPress}>
      <PostHeader />
      {postScreen.postCollapsed ? (
        <YStack m="$3">
          <Text color="$secondary" fontSize="$3" fontStyle="italic">
            Post Collapsed
          </Text>
        </YStack>
      ) : (
        <PostContent />
      )}
      <PostFooter />
      <PostActionBar />
      {showLoadAll && (
        <XStack backgroundColor="$warn" onPress={onLoadAllPress} p="$3">
          <Text fontSize="$3" color="$secondary" fontStyle="italic">
            Load All Comments
          </Text>
        </XStack>
      )}
    </YStack>
  );
}

export default React.memo(Post);
