import React, { useMemo } from 'react';
import { useSubscriptions } from '@src/state/site/siteStore';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { CommunityView } from 'lemmy-js-client';
import DrawerItem from '@components/Common/Drawer/DrawerItem';
import VStack from '@components/Common/Stack/VStack';
import { Separator } from 'tamagui';
import { addAlphabeticalLabels } from '@src/helpers';
import DrawerLabel from '@components/Common/Drawer/DrawerLabel';

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
  const itemType = getItemType(item);

  if (itemType === 'community') {
    return <DrawerItem view={item as CommunityView} />;
  } else {
    return <DrawerLabel char={item as string} />;
  }
};

const keyExtractor = (item: CommunityView | string): string => {
  const itemType = getItemType(item);

  if (itemType === 'community')
    return (item as CommunityView).community.id.toString();
  else return item as string;
};

export default function Drawer(): React.JSX.Element {
  const subscriptions = useSubscriptions();

  const subscriptionsWithLabels = useMemo(
    () => addAlphabeticalLabels(subscriptions),
    [subscriptions],
  );

  return (
    <VStack flex={1} backgroundColor="$bg">
      <VStack marginTop={100} flex={1}>
        <FlashList<CommunityView | string>
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          data={subscriptionsWithLabels}
          getItemType={getItemType}
          estimatedItemSize={80}
          ItemSeparatorComponent={() => <Separator />}
          contentContainerStyle={{
            paddingBottom: 100,
          }}
        />
      </VStack>
    </VStack>
  );
}
