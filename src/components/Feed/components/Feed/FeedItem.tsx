import React, { useCallback, useMemo } from 'react';
import FeedItemHeader from '@components/Feed/components/Feed/FeedItem/FeedItemHeader';
import FeedItemContainer from '@components/Feed/components/Feed/FeedItem/FeedItemContainer';
import FeedItemFooter from '@components/Feed/components/Feed/FeedItem/FeedItemFooter';
import FeedItemPostInfo from '@components/Feed/components/Feed/FeedItem/FeedItemPostInfo';
import FeedItemActionButtons from '@components/Feed/components/Feed/FeedItem/FeedItemActionButtons';
import { Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FeedItemContent from '@components/Feed/components/Feed/FeedItem/FeedItemContent';
import { setPostRead, useMarkReadOnPostOpen, usePostSaved } from '@src/state';
import { View } from 'tamagui';
import { Swipeable } from 'react-native-reanimated-swipeable';
import { usePostSwipeOptions } from '@components/Common/SwipeableRow/hooks/usePostSwipeOptions';
import { playHaptic } from '@helpers/haptics';

interface IProps {
  itemId: number;
}

function FeedItem({ itemId }: IProps): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const postSaved = usePostSaved(itemId);
  const markReadOnView = useMarkReadOnPostOpen();

  const actionParams = useMemo(
    () => ({
      navigation,
      postId: itemId,
    }),
    [itemId],
  );

  const leftSwipeOptions = usePostSwipeOptions('left', actionParams);
  const rightSwipeOptions = usePostSwipeOptions('right', actionParams);

  const onPress = useCallback(() => {
    navigation.push('Post', {
      postId: itemId,
    });

    // Should we mark it read?
    if (markReadOnView) {
      setPostRead({
        postId: itemId,
      });
    }
  }, [itemId, markReadOnView]);

  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      <Swipeable
        leftActionGroup={leftSwipeOptions ?? undefined}
        rightActionGroup={rightSwipeOptions ?? undefined}
        options={{
          onHitStep: playHaptic,
        }}
      >
        {postSaved && (
          <View
            position="absolute"
            top={0}
            right={0}
            width={0}
            height={0}
            backgroundColor="transparent"
            borderTopColor="$bookmark"
            borderTopWidth={15}
            borderLeftWidth={15}
            borderLeftColor="transparent"
            zIndex={1}
          />
        )}
        <FeedItemContainer>
          <FeedItemHeader itemId={itemId} />
          <FeedItemContent itemId={itemId} />
          <FeedItemFooter>
            <FeedItemPostInfo itemId={itemId} />
            <FeedItemActionButtons itemId={itemId} />
          </FeedItemFooter>
        </FeedItemContainer>
      </Swipeable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    marginVertical: 3,
  },
});

export default React.memo(FeedItem);
