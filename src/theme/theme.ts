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
  colors: IColors;
  config: {
    initialColorMode: "unspecified" | "light" | "dark";
  };
}

export const themeMap: Record<string, ITheme> = {
  moodyPurpleTheme: {
    colors: {
      ...moodyPurpleThemeColors,
    },
    config: {
      initialColorMode: "dark",
    },
  },
  darkTheme: {
    colors: {
      ...darkThemeColors,
    },

    config: {
      initialColorMode: "dark",
    },
  },
  draculaTheme: {
    colors: {
      ...draculaThemeColors,
    },
    config: {
      initialColorMode: "dark",
    },
  },
  draculaThemePurple: {
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
    colors: {
      ...lightThemeColors,
    },

    config: {
      initialColorMode: "light",
    },
  },
  nightOwlTheme: {
    colors: {
      ...nightOwlThemeColors,
    },
    config: {
      initialColorMode: "dark",
    },
  },
  sleepyRainforestTheme: {
    colors: {
      ...sleepyRainforestThemeColors,
    },

    config: {
      initialColorMode: "dark",
    },
  },
  goldenHourTheme: {
    colors: {
      ...goldenHourThemeColors,
    },

    config: {
      initialColorMode: "dark",
    },
  },
  nauticalTheme: {
    colors: {
      ...nauticalThemeColors,
    },

    config: {
      initialColorMode: "dark",
    },
  },
  sunsetTheme: {
    colors: {
      ...sunsetThemeColors,
    },
    config: {
      initialColorMode: "dark",
    },
  },
  oksolarDarkTheme: {
    colors: {
      ...oksolarDarkThemeColors,
    },
    config: {
      initialColorMode: "dark",
    },
  },
  oksolarLightTheme: {
    colors: {
      ...oksolarLightThemeColors,
    },
    config: {
      initialColorMode: "light",
    },
  },
  oledTheme: {
    colors: {
      ...oledThemeColors,
    },
    config: {
      initialColorMode: "dark",
    },
  },
  embarkTheme: {
    colors: {
      ...embarkThemeColors,
    },
    config: {
      initialColorMode: "dark",
    },
  },
};
