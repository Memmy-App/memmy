import { ICustomTheme } from "native-base";
import {
  moodyPurpleTheme,
  darkTheme,
  draculaTheme,
  draculaThemePurple,
  lightTheme,
  nightOwlTheme,
  oksolarDarkTheme,
  sleepyRainforestTheme,
  goldenHourTheme,
  nauticalTheme,
  sunsetTheme,
  oledTheme,
} from "./theme";

enum EThemeOptions {
  LIGHT = "Light",
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
}

export type ThemeOptions = `${EThemeOptions}`;

export const ThemeOptionsArr = Object.values(EThemeOptions);

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
  "Sleepy Rainforest": sleepyRainforestTheme,
  "Golden Hour": goldenHourTheme,
  Nautical: nauticalTheme,
  Sunset: sunsetTheme,
};
