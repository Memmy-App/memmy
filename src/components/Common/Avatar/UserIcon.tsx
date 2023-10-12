import React from 'react';
import { User } from '@tamagui/lucide-icons';
import { Image } from 'expo-image';

interface IProps {
  userIcon?: string;
}

function UserIcon({ userIcon }: IProps): React.JSX.Element {
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
    />
  );
}

export default React.memo(UserIcon);
