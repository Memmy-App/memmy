import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import LoadingOverlay from '@components/Common/Loading/LoadingOverlay';
import { Alert, FlatList } from 'react-native';
import { GetSiteResponse } from 'lemmy-js-client';
import OnboardingInstanceListItem from '@components/Onboarding/OnboardingInstanceList/components/OnboardingInstanceListItem';
import VStack from '@components/Common/Stack/VStack';
import OnboardingInstanceListHeader from '@components/Onboarding/OnboardingInstanceList/components/OnboardingInstanceListHeader';
import getInstanceList from '@api/instanceList/getInstanceList';

const keyExtractor = (item: GetSiteResponse): string => {
  return item.site_view.site.name;
};

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

const renderItem = ({ item }) => {
  return <OnboardingInstanceListItem item={item} />;
};

export default function OnboardingInstanceListScreen({
  navigation,
}: IProps): React.JSX.Element {
  const { isLoading, data } = useQuery(['onboardingInstanceList'], async () => {
    return await getInstanceList().catch((err): GetSiteResponse[] => {
      Alert.alert('Error', err.message);
      return [];
    });
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
