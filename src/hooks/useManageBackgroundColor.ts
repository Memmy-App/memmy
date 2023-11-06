import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { useTheme } from 'tamagui';

export const useManageRootBackgroundColor = (): void => {
  const theme = useTheme();

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(theme.bg.val);
  }, [theme]);
};
