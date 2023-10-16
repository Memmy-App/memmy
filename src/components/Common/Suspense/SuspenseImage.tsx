import React, { Suspense } from 'react';
import { Image, ImageProps } from 'expo-image';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'tamagui';

export default function SuspenseImage(props: ImageProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <Suspense
      fallback={<ActivityIndicator size="large" color={theme.secondary.val} />}
    >
      <Image {...props} />
    </Suspense>
  );
}
