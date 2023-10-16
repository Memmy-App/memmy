import React, { useEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { CommunityView } from 'lemmy-js-client';
import { Text } from 'tamagui';
import VStack from '@components/Common/Stack/VStack';

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

const renderItem = ({
  item,
}: ListRenderItemInfo<CommunityView>): React.JSX.Element => {
  return <Text>{item.community.name}</Text>;
};

const keyExtractor = (item: CommunityView): string =>
  item.community.id.toString();

export default function SubscriptionsScreen({
  navigation,
}: IProps): React.JSX.Element {
  // Set the header options
  useEffect(() => {
    navigation.setOptions({
      headerBackTitle: 'Back',
    });
  }, []);

  return (
    <VStack flex={1}>
      <FlashList renderItem={renderItem} keyExtractor={keyExtractor} />
    </VStack>
  );
}
