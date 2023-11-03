import React from 'react';
import { User } from '@tamagui/lucide-icons';
import { Image } from 'expo-image';
import { useAnimateAvatars } from '@src/state';

interface IProps {
  userIcon?: string;
}

function UserIcon({ userIcon }: IProps): React.JSX.Element {
  const animateAvatars = useAnimateAvatars();

  if (userIcon == null) {
    return <User size={14} color="$accent" />;
  }

  return (
    <Image
      source={{ uri: userIcon }}
      style={{
        width: 16,
        height: 16,
        borderRadius: 25,
      }}
      autoplay={animateAvatars}
    />
  );
}

export default React.memo(UserIcon);
