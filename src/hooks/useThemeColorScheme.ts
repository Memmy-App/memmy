import { useTheme } from 'tamagui';
import { useMemo } from 'react';

export const useThemeColorScheme = (): 'light' | 'dark' => {
  const theme = useTheme();

  const colorScheme = useMemo<'light' | 'dark'>(
    () => theme.colorScheme.val as 'light' | 'dark',
    [theme.colorScheme],
  );

  return colorScheme;
};
