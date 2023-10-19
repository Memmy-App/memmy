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
import { LeftOptions } from '@components/Common/SwipeableRow/LeftOptions';
import { SwipeableRow } from '@components/Common/SwipeableRow/SwipeableRow';
import { usePostGesturesEnabled } from '@src/state';
import { RightOptions } from '@components/Common/SwipeableRow/RightOptions';
import { usePostSwipeOptions } from '@components/Common/SwipeableRow/hooks/usePostSwipeOptions';

interface IProps {
  itemId: number;
}

function FeedItem({ itemId }: IProps): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const gesturesEnabled = usePostGesturesEnabled();
  const leftSwipeOptions = usePostSwipeOptions('left');
  const rightSwipeOptions = usePostSwipeOptions('right');

  const onPress = useCallback(() => {
    navigation.push('Post', {
      postId: itemId,
    });
  }, [itemId]);

  const actionParams = useMemo(() => {
    return {
      postId: itemId,
      navigation,
    };
  }, [itemId, navigation]);

  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      <SwipeableRow
        leftOption={
          gesturesEnabled && leftSwipeOptions.actions.first != null ? (
            <LeftOptions
              options={leftSwipeOptions}
              actionParams={actionParams}
            />
          ) : undefined
        }
        rightOption={
          gesturesEnabled && rightSwipeOptions.actions.first !== null ? (
            <RightOptions
              options={rightSwipeOptions}
              actionParams={actionParams}
            />
          ) : undefined
        }
      >
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
