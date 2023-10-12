import React, { useCallback } from 'react';
import FeedItemHeader from '@components/Feed/components/Feed/FeedItem/FeedItemHeader';
import FeedItemContainer from '@components/Feed/components/Feed/FeedItem/FeedItemContainer';
import FeedItemFooter from '@components/Feed/components/Feed/FeedItem/FeedItemFooter';
import FeedItemPostInfo from '@components/Feed/components/Feed/FeedItem/FeedItemPostInfo';
import FeedItemActionButtons from '@components/Feed/components/Feed/FeedItem/FeedItemActionButtons';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FeedItemContent from '@components/Feed/components/Feed/FeedItem/FeedItemContent';

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

  return (
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
  );
}

export default React.memo(FeedItem);
