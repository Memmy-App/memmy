import {
  moodyPurpleTheme,
  darkTheme,
  draculaTheme,
  draculaThemePurple,
  lightTheme,
  nightOwlTheme,
  sleepyRainforestTheme,
  goldenHourTheme,
  nauticalTheme,
} from "./theme";

enum EThemeOptions {
  LIGHT = "Light",
  DARK = "Dark",
  DRACULA = "Dracula",
  DRACULA_PURPLE = "Dracula (Purple)",
  MOODY_PURPLE = "Moody Purple",
  NIGHT_OWL = "Night Owl",
  SLEEPY_RAINFOREST = "Sleepy Rainforest",
  GOLDEN_HOUR = "Golden Hour",
  NAUTICAL = "Nautical",
}

export type ThemeOptions = `${EThemeOptions}`;

export const ThemeOptionsArr = Object.values(EThemeOptions);

// TODO: should get the type figured out for theme obj
export const ThemeOptionsMap: Record<ThemeOptions, any> = {
  Light: lightTheme,
  Dark: darkTheme,
  Dracula: draculaTheme,
  "Dracula (Purple)": draculaThemePurple,
  "Moody Purple": moodyPurpleTheme,
  "Night Owl": nightOwlTheme,
  "Sleepy Rainforest": sleepyRainforestTheme,
  "Golden Hour": goldenHourTheme,
  Nautical: nauticalTheme,
};
