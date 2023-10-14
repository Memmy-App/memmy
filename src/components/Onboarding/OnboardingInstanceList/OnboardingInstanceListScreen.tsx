import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LoadingOverlay from '@components/Common/Loading/LoadingOverlay';
import { FlatList } from 'react-native';
import { GetSiteResponse } from 'lemmy-js-client';
import OnboardingInstanceListItem from '@components/Onboarding/OnboardingInstanceList/components/OnboardingInstanceListItem';
import VStack from '@components/Common/Stack/VStack';
import OnboardingInstanceListHeader from '@components/Onboarding/OnboardingInstanceList/components/OnboardingInstanceListHeader';
import getInstanceList from '@api/instanceList/getInstanceList';
import { useLoadData } from '@hooks/useLoadData';

const keyExtractor = (item: GetSiteResponse): string => {
  return item.site_view.site.name;
};

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

interface RenderItem {
  item: GetSiteResponse;
}

const renderItem = ({ item }: RenderItem): React.JSX.Element => {
  return <OnboardingInstanceListItem item={item} />;
};

export default function OnboardingInstanceListScreen({
  navigation,
}: IProps): React.JSX.Element {
  const { isLoading, data } = useLoadData<GetSiteResponse[]>(async () => {
    return await getInstanceList();
  });

  return (
    <VStack flex={1}>
      <LoadingOverlay visible={isLoading} />
      <FlatList
        renderItem={renderItem}
        data={data}
        keyExtractor={keyExtractor}
        ListHeaderComponent={<OnboardingInstanceListHeader />}
        contentContainerStyle={{
          paddingBottom: 150,
        }}
      />
    </VStack>
  );
}
