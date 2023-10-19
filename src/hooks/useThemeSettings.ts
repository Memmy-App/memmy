import {
  useAccent,
  useDarkTheme,
  useLightTheme,
  useMatchSystemTheme,
  useRegularTheme,
} from '@src/state';
import { useColorScheme } from 'react-native';
import {
  updateTheme,
  useForceUpdate,
  useIsomorphicLayoutEffect,
} from 'tamagui';
import { useState } from 'react';
import { customTokens } from '@src/theme';
import { IThemeOption } from '@src/types';

export interface UseThemeSettings {
  theme: IThemeOption;
  initialized: boolean;
}

export const useThemeSettings = (): UseThemeSettings => {
  const regularTheme = useRegularTheme();
  const lightTheme = useLightTheme();
  const darkTheme = useDarkTheme();
  const matchSystem = useMatchSystemTheme();
  const accent = useAccent();

  const colorScheme = useColorScheme();
  const update = useForceUpdate();

  const [initialized, setInitialized] = useState(false);
  const [theme, setTheme] = useState<IThemeOption>(regularTheme);

  useIsomorphicLayoutEffect(() => {
    let themeToUse: IThemeOption = regularTheme;

    if (matchSystem) {
      if (colorScheme === 'light') {
        themeToUse = lightTheme;
      } else if (colorScheme === 'dark') {
        themeToUse = darkTheme;
      }
    }

    updateTheme({
      name: themeToUse,
      theme: {
        ...customTokens[`${themeToUse}Colors`],
        ...(accent != null && {
          accent,
        }),
      },
    });
    update();

    if (!initialized) {
      setInitialized(true);
    }

    setTheme(themeToUse);
  }, [accent, lightTheme, darkTheme, colorScheme, matchSystem, regularTheme]);

  return {
    theme,
    initialized,
  };
};
