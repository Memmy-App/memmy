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
import { RightOptions } from '@components/Common/SwipeableRow/RightOptions';
import { ISwipeableColors } from '@components/Common/SwipeableRow/types';
import { useSwipeOptions } from '@components/Common/SwipeableRow/hooks/useSwipeOptions';
import { SwipeableRow } from '@components/Common/SwipeableRow/SwipeableRow';
import { LeftOptions } from '@components/Common/SwipeableRow/LeftOptions';

interface IProps {
  itemId: number;
}

function FeedItem({ itemId }: IProps): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const onPress = useCallback(() => {
    navigation.navigate('Post', {
      postId: itemId,
    });
  }, [itemId]);

  const swipeRightOptions = useSwipeOptions('post', 'left');

  const leftColors: ISwipeableColors = useMemo(
    () => ({
      first: swipeRightOptions.firstColor ?? '$accent',
      second: swipeRightOptions.secondColor ?? '$accent',
    }),
    [],
  );

  const onLeftFirst = useCallback(() => {
    if (swipeRightOptions.firstAction != null) {
      swipeRightOptions.firstAction({
        itemId,
      });
    }
  }, [itemId, swipeRightOptions]);

  const onLeftSecond = useCallback(() => {
    if (swipeRightOptions.secondAction != null) {
      swipeRightOptions.secondAction({
        itemId,
      });
    }
  }, [itemId]);

  const rightOption = useMemo(
    () => (
      <RightOptions
        colors={leftColors}
        onFirst={onLeftFirst}
        onSecond={onLeftSecond}
        firstIcon="upvote"
        secondIcon="downvote"
      />
    ),
    [leftColors, onLeftFirst, onLeftSecond],
  );

  const leftOption = useMemo(
    () => (
      <LeftOptions
        colors={leftColors}
        onFirst={onLeftFirst}
        onSecond={onLeftSecond}
        firstIcon="upvote"
        secondIcon="downvote"
      />
    ),
    [leftColors, onLeftFirst, onLeftSecond],
  );

  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      <SwipeableRow leftOption={rightOption} rightOption={leftOption}>
        <FeedItemContainer>
          <FeedItemHeader itemId={itemId} />
          <FeedItemContent itemId={itemId} />
          <FeedItemFooter>
            <FeedItemPostInfo itemId={itemId} />
            <FeedItemActionButtons itemId={itemId} />
          </FeedItemFooter>
        </FeedItemContainer>
      </SwipeableRow>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    marginVertical: 3,
  },
});

export default React.memo(FeedItem);
