import { ITheme, themeMap } from "./theme";

enum EDarkThemeOptions {
  DARK = "Dark",
  DRACULA = "Dracula",
  DRACULA_PURPLE = "Dracula (Purple)",
  MOODY_PURPLE = "Moody Purple",
  NIGHT_OWL = "Night Owl",
  OKSOLAR_DARK = "Oksolar Dark",
  SLEEPY_RAINFOREST = "Sleepy Rainforest",
  GOLDEN_HOUR = "Golden Hour",
  NAUTICAL = "Nautical",
  SUNSET = "Sunset",
  OLED = "Dark (OLED)",
  EMBARK = "Embark",
}

enum ELightThemeOptions {
  LIGHT = "Light",
  OKSOLAR_LIGHT = "Oksolar Light",
}

export type ThemeOptions = `${EDarkThemeOptions}` | `${ELightThemeOptions}`;

export const LightThemeOptionsArr = Object.values(ELightThemeOptions);
export const DarkThemeOptionsArr = Object.values(EDarkThemeOptions);

export const ThemeOptionsArr = [
  ...LightThemeOptionsArr,
  ...DarkThemeOptionsArr,
];

// TODO: should get the type figured out for theme obj
export const ThemeOptionsMap: Record<ThemeOptions, ITheme> = {
  Light: themeMap.lightTheme,
  Dark: themeMap.darkTheme,
  "Dark (OLED)": themeMap.oledTheme,
  Dracula: themeMap.draculaTheme,
  "Dracula (Purple)": themeMap.draculaThemePurple,
  "Moody Purple": themeMap.moodyPurpleTheme,
  "Night Owl": themeMap.nightOwlTheme,
  "Oksolar Dark": themeMap.oksolarDarkTheme,
  "Oksolar Light": themeMap.oksolarLightTheme,
  "Sleepy Rainforest": themeMap.sleepyRainforestTheme,
  "Golden Hour": themeMap.goldenHourTheme,
  Nautical: themeMap.nauticalTheme,
  Sunset: themeMap.sunsetTheme,
  Embark: themeMap.embarkTheme,
};
