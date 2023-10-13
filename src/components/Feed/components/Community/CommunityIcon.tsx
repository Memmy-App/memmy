import React from 'react';
import {
  useCommunityIcon,
  useCommunityNsfw,
} from '@src/state/community/communityStore';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { Globe } from '@tamagui/lucide-icons';

interface IProps {
  itemId: number;
}

function CommunityIcon({ itemId }: IProps): React.JSX.Element {
  const communityIcon = useCommunityIcon(itemId);
  const communityNsfw = useCommunityNsfw(itemId);

  if (communityIcon == null) {
    return <Globe color="$accent" size="$4" />;
  }

  return (
    <Image
      source={{ uri: communityIcon }}
      style={styles.image}
      blurRadius={communityNsfw ? 90 : 0}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});

export default React.memo(CommunityIcon);
