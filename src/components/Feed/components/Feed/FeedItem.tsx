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
import {
  markPostRead,
  useMarkReadOnPostView,
  usePostGesturesEnabled,
  usePostSaved,
} from '@src/state';
import { RightOptions } from '@components/Common/SwipeableRow/RightOptions';
import { usePostSwipeOptions } from '@components/Common/SwipeableRow/hooks/usePostSwipeOptions';
import { View } from 'tamagui';

interface IProps {
  itemId: number;
}

function FeedItem({ itemId }: IProps): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const gesturesEnabled = usePostGesturesEnabled();
  const leftSwipeOptions = usePostSwipeOptions('left');
  const rightSwipeOptions = usePostSwipeOptions('right');

  const postSaved = usePostSaved(itemId);
  const markReadOnView = useMarkReadOnPostView();

  const onPress = useCallback(() => {
    navigation.push('Post', {
      postId: itemId,
    });

    // Should we mark it read?
    if (markReadOnView) {
      markPostRead(itemId);
    }
  }, [itemId, markReadOnView]);

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
