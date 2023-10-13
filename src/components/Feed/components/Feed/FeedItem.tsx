import React, { useCallback, useMemo } from 'react';
import FeedItemHeader from '@components/Feed/components/Feed/FeedItem/FeedItemHeader';
import FeedItemContainer from '@components/Feed/components/Feed/FeedItem/FeedItemContainer';
import FeedItemFooter from '@components/Feed/components/Feed/FeedItem/FeedItemFooter';
import FeedItemPostInfo from '@components/Feed/components/Feed/FeedItem/FeedItemPostInfo';
import FeedItemActionButtons from '@components/Feed/components/Feed/FeedItem/FeedItemActionButtons';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FeedItemContent from '@components/Feed/components/Feed/FeedItem/FeedItemContent';
import { SwipeableRow } from '@components/Common/SwipeableRow/SwipeableRow';
import { RightOptions } from '@components/Common/SwipeableRow/RightOptions';
import { useTheme } from 'tamagui';
import { ISwipeableColors } from '@components/Common/SwipeableRow/types';
import instance from '@api/Instance';
import { ArrowDown, ArrowUp } from '@tamagui/lucide-icons';

interface IProps {
  itemId: number;
}

function FeedItem({ itemId }: IProps): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const theme = useTheme();

  const onPress = useCallback(() => {
    navigation.navigate('Post', {
      postId: itemId,
    });
  }, [itemId]);

  const rightColors: ISwipeableColors = useMemo(
    () => ({
      first: theme.upvote.val,
      second: theme.downvote.val,
    }),
    [theme],
  );

  const onRightFirst = useCallback(() => {
    void instance.likePost(itemId, 1);
  }, [itemId]);

  const onRightSecond = useCallback(() => {
    void instance.likePost(itemId, -1);
  }, [itemId]);

  const rightOption = useMemo(
    () => (
      <RightOptions
        colors={rightColors}
        onFirst={onRightFirst}
        onSecond={onRightSecond}
        firstIcon={ArrowUp}
        secondIcon={ArrowDown}
      />
    ),
    [rightColors, onRightFirst, onRightSecond],
  );

  return (
    <SwipeableRow leftOption={rightOption}>
      <Pressable onPress={onPress}>
        <FeedItemContainer>
          <FeedItemHeader itemId={itemId} />
          <FeedItemContent itemId={itemId} />
          <FeedItemFooter>
            <FeedItemPostInfo itemId={itemId} />
            <FeedItemActionButtons itemId={itemId} />
          </FeedItemFooter>
        </FeedItemContainer>
      </Pressable>
    </SwipeableRow>
  );
}

export default React.memo(FeedItem);
