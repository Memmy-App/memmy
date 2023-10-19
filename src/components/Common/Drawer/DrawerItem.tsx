import React, { useCallback, useMemo } from 'react';
import { CommunityView } from 'lemmy-js-client';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import VStack from '@components/Common/Stack/VStack';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { Globe, Star, StarOff } from '@tamagui/lucide-icons';
import HStack from '@components/Common/Stack/HStack';
import { Text, View } from 'tamagui';
import { getBaseUrl } from '@helpers/links';
import { useCurrentAccount } from '@src/state/account/accountStore';
import { addOrUpdateFavorite, useAccountFavorites } from '@src/state';

interface IProps {
  view: CommunityView;
}

function DrawerItem({ view }: IProps): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const currentAccount = useCurrentAccount();
  const favorites = useAccountFavorites(currentAccount!.fullUsername);

  const instance = useMemo(() => getBaseUrl(view.community.actor_id), [view]);

  const favorited = useMemo(
    () => favorites?.includes(view.community.id),
    [favorites],
  );

  const onCommunityPress = useCallback(() => {
    navigation.navigate('Community', { id: view.community.id });
  }, [view]);

  const onFavoritePress = useCallback(() => {
    addOrUpdateFavorite(currentAccount!.fullUsername, view.community.id);
  }, [currentAccount, view]);

  return (
    <HStack space="$2" onPress={onCommunityPress}>
      {view.community.icon != null ? (
        <Image source={view.community.icon} style={styles.image} />
      ) : (
        <Globe color="$accent" />
      )}
      <VStack>
        <Text fontSize="$3">{view.community.name}</Text>
        <Text fontSize="$2" color="$secondary">
          {instance}
        </Text>
      </VStack>
      <View marginRight="auto" onPress={onFavoritePress}>
        {favorited === true ? (
          <Star color="$accent" />
        ) : (
          <StarOff color="$accent" />
        )}
      </View>
    </HStack>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 30,
    width: 30,
  },
});

export default React.memo(DrawerItem);
