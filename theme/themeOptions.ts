import {
  brownTheme,
  darkTheme,
  draculaTheme,
  draculaThemePurple,
  lightTheme,
  nightOwlTheme,
  purpleTheme,
  oksolarDarkTheme,
  oksolarLightTheme,
} from "./theme";

enum EThemeOptions {
  BROWN = "Brown",
  LIGHT = "Light",
  DARK = "Dark",
  PURPLE = "Purple",
  DRACULA = "Dracula",
  DRACULA_PURPLE = "Dracula (Purple)",
  NIGHT_OWL = "Night Owl",
  OKSOLAR_DARK = "Oksolar Dark",
  OKSOLAR_LIGHT = "Oksolar Light"
}

export type ThemeOptions = `${EThemeOptions}`;

export const ThemeOptionsArr = Object.values(EThemeOptions);

// TODO: should get the type figured out for theme obj
export const ThemeOptionsMap: Record<ThemeOptions, any> = {
  Brown: brownTheme,
  Dark: darkTheme,
  Light: lightTheme,
  Purple: purpleTheme,
  Dracula: draculaTheme,
  "Dracula (Purple)": draculaThemePurple,
  "Night Owl": nightOwlTheme,
  "Oksolar Dark" : oksolarDarkTheme,
  "Oksolar Light" : oksolarLightTheme,
};
