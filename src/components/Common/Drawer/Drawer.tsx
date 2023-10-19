import React from 'react';
import { useSubscriptions } from '@src/state/site/siteStore';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { CommunityView } from 'lemmy-js-client';
import DrawerItem from '@components/Common/Drawer/DrawerItem';
import VStack from '@components/Common/Stack/VStack';

const getItemType = (item: CommunityView | string): 'community' | 'label' => {
  if ((item as CommunityView).community != null) {
    return 'community';
  } else {
    return 'label';
  }
};

const renderItem = ({
  item,
}: ListRenderItemInfo<CommunityView | string>): React.JSX.Element => {
  // const itemType = getItemType(item);

  console.log(item);

  return <DrawerItem view={item as CommunityView} />;

  // if (itemType === 'community') {
  //   return 'blah';
  // } else {
  //   return 'grr';
  // }
};

const keyExtractor = (item: CommunityView | string): string => {
  const itemType = getItemType(item);

  if (itemType === 'community')
    return (item as CommunityView).community.id.toString();
  else return item as string;
};

export default function Drawer(): React.JSX.Element {
  const subscriptions = useSubscriptions();

  console.log(subscriptions);

  return (
    <VStack flex={1} backgroundColor="$bg">
      <FlashList<CommunityView | string>
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        data={subscriptions}
        getItemType={getItemType}
        estimatedItemSize={80}
      />
    </VStack>
  );
}
