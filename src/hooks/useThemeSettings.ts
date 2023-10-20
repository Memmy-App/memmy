import {
  useAccent,
  useDarkTheme,
  useFontSize,
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
import { useEffect, useRef, useState } from 'react';
import { customTokens } from '@src/theme';
import { IThemeOption } from '@src/types';
import { updateFont } from '@tamagui/web';

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

  const fontSize = useFontSize();

  const lastColorScheme = useRef(colorScheme);
  const [usedColorScheme, setUsedColorScheme] = useState(colorScheme);

  const [fontInitialized, setFontInitialized] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [theme, setTheme] = useState<IThemeOption>(regularTheme);

  useEffect(() => {
    if (colorScheme !== lastColorScheme.current) {
      setTimeout(() => {
        if (colorScheme === lastColorScheme.current) {
          setUsedColorScheme(colorScheme);
        }
      }, 500);
    }

    lastColorScheme.current = colorScheme;
  }, [colorScheme]);

  useIsomorphicLayoutEffect(() => {
    updateFont('body', {
      size: {
        1: fontSize - 4,
        2: fontSize - 2,
        3: fontSize,
        4: fontSize + 2,
        5: fontSize + 4,
        6: fontSize + 6,
      },
    });

    update();

    setFontInitialized(true);
  }, [fontSize]);

  useIsomorphicLayoutEffect(() => {
    if (!fontInitialized) return;

    let themeToUse: IThemeOption = regularTheme;

    if (matchSystem) {
      if (usedColorScheme === 'light') {
        themeToUse = lightTheme;
      } else if (usedColorScheme === 'dark') {
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
        content: fontSize,
        header: fontSize + 4,
      },
    });

    update();

    if (!initialized) {
      setInitialized(true);
    }

    setTheme(themeToUse);
  }, [
    fontInitialized,
    accent,
    lightTheme,
    darkTheme,
    usedColorScheme,
    matchSystem,
    regularTheme,
    fontSize,
  ]);

  return {
    theme,
    initialized,
  };
};
