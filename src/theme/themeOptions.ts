import { ICustomTheme } from "native-base";
import {
  moodyPurpleTheme,
  darkTheme,
  draculaTheme,
  draculaThemePurple,
  lightTheme,
  nightOwlTheme,
  oksolarDarkTheme,
  oksolarLightTheme,
  oceanicNextTheme,
  sleepyRainforestTheme,
  goldenHourTheme,
  nauticalTheme,
  sunsetTheme,
  oledTheme,
  embarkTheme,
} from "./theme";

enum EDarkThemeOptions {
  DARK = "Dark",
  DRACULA = "Dracula",
  DRACULA_PURPLE = "Dracula (Purple)",
  MOODY_PURPLE = "Moody Purple",
  NIGHT_OWL = "Night Owl",
  OKSOLAR_DARK = "Oksolar Dark",
  OKSOLAR_LIGHT = "Oksolar Light",
  OCEANIC_NEXT = "Oceanic Next",
  SLEEPY_RAINFOREST = "Sleepy Rainforest",
  GOLDEN_HOUR = "Golden Hour",
  NAUTICAL = "Nautical",
  SUNSET = "Sunset",
  OLED = "Dark (OLED)",
  EMBARK = "Embark",
}

enum ELightThemeOptions {
  LIGHT = "Light",
}

export type ThemeOptions = `${EDarkThemeOptions}` | `${ELightThemeOptions}`;

export const LightThemeOptionsArr = Object.values(ELightThemeOptions);
export const DarkThemeOptionsArr = Object.values(EDarkThemeOptions);

export const ThemeOptionsArr = [
  ...LightThemeOptionsArr,
  ...DarkThemeOptionsArr,
];

// TODO: should get the type figured out for theme obj
export const ThemeOptionsMap: Record<ThemeOptions, ICustomTheme> = {
  Light: lightTheme,
  Dark: darkTheme,
  "Dark (OLED)": oledTheme,
  Dracula: draculaTheme,
  "Dracula (Purple)": draculaThemePurple,
  "Moody Purple": moodyPurpleTheme,
  "Night Owl": nightOwlTheme,
  "Oksolar Dark": oksolarDarkTheme,
  "Oksolar Light" : oksolarLightTheme,
  "Oceanic Next" : oceanicNextTheme,
  "Sleepy Rainforest": sleepyRainforestTheme,
  "Golden Hour": goldenHourTheme,
  Nautical: nauticalTheme,
  Sunset: sunsetTheme,
  Embark: embarkTheme,
};
