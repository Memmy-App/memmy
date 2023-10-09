import { createThemeBuilder } from '@tamagui/theme-builder';

const themeBuilder = createThemeBuilder()
  .addPalettes({
    dark: ['#000', '#111', '#222', '#999', '#ccc', '#eee', '#fff'],
    light: ['#fff', '#eee', '#ccc', '#999', '#222', '#111', '#000'],
    oksolar: ['#fff', '#eee', '#ccc', '#999', '#222', '#111', '#000'],
    dracula: ['#fff', '#eee', '#ccc', '#999', '#222', '#111', '#000'],
    oksolarLight: ['#fff', '#eee', '#ccc', '#999', '#222', '#111', '#000'],
  })
  .addTemplates({
    base: {
      background: 0,
      color: -0,
    },
  })
  .addThemes({
    light: {
      template: 'base',
      palette: 'light',
    },
    dark: {
      template: 'base',
      palette: 'dark',
    },
  });
