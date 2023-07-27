import {
  darkThemeColors,
  draculaThemeColors,
  goldenHourThemeColors,
  moodyPurpleThemeColors,
  nauticalThemeColors,
  nightOwlThemeColors,
  sleepyRainforestThemeColors,
  sunsetThemeColors,
  oksolarDarkThemeColors,
  oledThemeColors,
  embarkThemeColors,
} from "./darkColors";
import { IColors } from "./common";
import { lightThemeColors, oksolarLightThemeColors } from "./lightColors";

export interface ITheme {
  name: string;
  colors: IColors;
  config: {
    initialColorMode?: "light" | "dark";
  };
}

export const themeMap: Record<string, ITheme> = {
  moodyPurpleTheme: {
    name: "moodyPurple",
    colors: {
      ...moodyPurpleThemeColors,
    },
    config: {
      initialColorMode: "dark",
    },
  },
  darkTheme: {
    name: "dark",
    colors: {
      ...darkThemeColors,
    },

    config: {
      initialColorMode: "dark",
    },
  },
  draculaTheme: {
    name: "dracula",
    colors: {
      ...draculaThemeColors,
    },
    config: {
      initialColorMode: "dark",
    },
  },
  draculaThemePurple: {
    name: "draculaPurple",
    colors: {
      ...{
        ...draculaThemeColors,
        accent: "#bd93f9",
      },
    },
    config: {
      initialColorMode: "dark",
    },
  },
  lightTheme: {
    name: "light",
    colors: {
      ...lightThemeColors,
    },

    config: {
      initialColorMode: "light",
    },
  },
  nightOwlTheme: {
    name: "nightOwl",
    colors: {
      ...nightOwlThemeColors,
    },
    config: {
      initialColorMode: "dark",
    },
  },
  sleepyRainforestTheme: {
    name: "sleepyRainforest",
    colors: {
      ...sleepyRainforestThemeColors,
    },

    config: {
      initialColorMode: "dark",
    },
  },
  goldenHourTheme: {
    name: "goldenHour",
    colors: {
      ...goldenHourThemeColors,
    },

    config: {
      initialColorMode: "dark",
    },
  },
  nauticalTheme: {
    name: "nautical",
    colors: {
      ...nauticalThemeColors,
    },

    config: {
      initialColorMode: "dark",
    },
  },
  sunsetTheme: {
    name: "sunset",
    colors: {
      ...sunsetThemeColors,
    },
    config: {
      initialColorMode: "dark",
    },
  },
  oksolarDarkTheme: {
    name: "oksolarDark",
    colors: {
      ...oksolarDarkThemeColors,
    },
    config: {
      initialColorMode: "dark",
    },
  },
  oksolarLightTheme: {
    name: "oksolarLight",
    colors: {
      ...oksolarLightThemeColors,
    },
    config: {
      initialColorMode: "light",
    },
  },
  oledTheme: {
    name: "oled",
    colors: {
      ...oledThemeColors,
    },
    config: {
      initialColorMode: "dark",
    },
  },
  embarkTheme: {
    name: "embark",
    colors: {
      ...embarkThemeColors,
    },
    config: {
      initialColorMode: "dark",
    },
  },
};
