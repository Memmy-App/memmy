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
import { ArrowDown, ArrowUp } from '@tamagui/lucide-icons';
import { useSwipeOptions } from '@components/Common/SwipeableRow/hooks/useSwipeOptions';
import { SwipeableRow } from '@components/Common/SwipeableRow/SwipeableRow';

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

  const swipeLeftOptions = useSwipeOptions('post', 'left');

  const leftColors: ISwipeableColors = useMemo(
    () => ({
      first: swipeLeftOptions.firstColor ?? '$accent',
      second: swipeLeftOptions.secondColor ?? '$accent',
    }),
    [],
  );

  const onLeftFirst = useCallback(() => {
    if (swipeLeftOptions.firstAction != null) {
      swipeLeftOptions.firstAction({
        itemId,
      });
    }
  }, [itemId, swipeLeftOptions]);

  const onLeftSecond = useCallback(() => {
    if (swipeLeftOptions.secondAction != null) {
      swipeLeftOptions.secondAction({
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
        firstIcon={ArrowUp}
        secondIcon={ArrowDown}
      />
    ),
    [leftColors, onLeftFirst, onLeftSecond],
  );

  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      <SwipeableRow leftOption={rightOption}>
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
