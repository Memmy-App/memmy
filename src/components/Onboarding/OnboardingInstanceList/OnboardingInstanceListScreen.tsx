import React, { useCallback } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import getInstanceList from '@api/InstanceList/getInstanceList';
import LoadingOverlay from '@components/Common/Loading/LoadingOverlay';
import { Alert } from 'react-native';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { GetSiteResponse } from 'lemmy-js-client';
import OnboardingInstanceListItem from '@components/Onboarding/OnboardingInstanceList/components/OnboardingInstanceListItem';
import VStack from '@components/Common/Stack/VStack';
import OnboardingInstanceListHeader from '@components/Onboarding/OnboardingInstanceList/components/OnboardingInstanceListHeader';

const keyExtractor = (item: GetSiteResponse): string => {
  return item.site_view.site.name;
};

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

export default function OnboardingInstanceListScreen({ navigation }: IProps): React.JSX.Element {
  const { isLoading, data } = useQuery(['onboardingInstanceList'], async() => {
    return await getInstanceList().catch((err): GetSiteResponse[] => {
      Alert.alert('Error', err.message);
      return [];
    });
  });

  const renderItem = useCallback((item: ListRenderItemInfo<GetSiteResponse>) => {
    return <OnboardingInstanceListItem item={item.item} />;
  }, []);

  return (
    <VStack flex={1}>
      <LoadingOverlay visible={isLoading} />
      <FlashList
        renderItem={renderItem}
        data={data}
        keyExtractor={keyExtractor}
        estimatedItemSize={100}
        ListHeaderComponent={<OnboardingInstanceListHeader />}
        contentContainerStyle={{
          paddingBottom: 150,
        }}
      />
    </VStack>
  );
}
