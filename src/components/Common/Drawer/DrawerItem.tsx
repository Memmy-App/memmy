import React, { useCallback, useMemo } from 'react';
import { CommunityView } from 'lemmy-js-client';
import { Text, View, XStack, YStack } from 'tamagui';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { Globe, Star, StarOff } from '@tamagui/lucide-icons';
import { getBaseUrl } from '@helpers/links';
import {
  addOrUpdateFavorite,
  setDrawerOpen,
  useAccountFavorites,
  useCurrentAccount,
} from '@src/state';
import { NavigationContainerRefWithCurrent } from '@react-navigation/core';
import { createName } from '@helpers/text';

interface IProps {
  view: CommunityView;
  navigation: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>;
}

function DrawerItem({ view, navigation }: IProps): React.JSX.Element {
  // const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const currentAccount = useCurrentAccount();
  const favorites = useAccountFavorites(currentAccount!.fullUsername);

  const instance = useMemo(() => getBaseUrl(view.community.actor_id), [view]);

  const favorited = useMemo(
    () => favorites?.includes(view.community.id),
    [favorites],
  );

  const onCommunityPress = useCallback(() => {
    setDrawerOpen(false);
    // @ts-expect-error this is valid
    navigation.navigate('Community', {
      name: createName(view.community.name, view.community.actor_id, true),
      id: view.community.id,
    });
  }, [view]);

  const onFavoritePress = useCallback(() => {
    addOrUpdateFavorite(currentAccount!.fullUsername, view.community.id);
  }, [currentAccount, view]);

  return (
    <XStack
      space="$2"
      onPress={onCommunityPress}
      alignItems="center"
      px="$3"
      py="$2"
      backgroundColor="$fg"
    >
      {view.community.icon != null ? (
        <Image source={view.community.icon} style={styles.image} />
      ) : (
        <Globe color="$accent" />
      )}
      <YStack>
        <Text fontSize="$3">{view.community.name}</Text>
        <Text fontSize="$2" color="$secondary">
          {instance}
        </Text>
      </YStack>
      <View ml="auto" onPress={onFavoritePress}>
        {favorited === true ? (
          <Star color="$accent" />
        ) : (
          <StarOff color="$accent" />
        )}
      </View>
    </XStack>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 30,
    width: 30,
    borderRadius: 100,
  },
});

export default React.memo(DrawerItem);
