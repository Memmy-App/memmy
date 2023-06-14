import {extendTheme} from "native-base";

const solarizedDarkTheme= extendTheme({
    colors: {
        screen: {
            50: "#fafaf9",
            100: "#626C6C",
            200: "#788484",
            300: "#96A7A9",
            400: "#405A61",
            500: "#56697A",
            600: "#13383C",
            700: "#00212C",
            800: "#03282F",
            900: "#073642",
        },

        lightText: "#ffffff",
        darkText: "#ffffff"
    },
    config: {
        initialColorMode: "dark"
    }
// example colors object
    colors: {
        red: '#dc322f',
        orange '#cb4b16',
        green '#859900',
        teal '#35a69c',
        yellow '#b58900',
        blue '#268bd2',
        dark-blue '#3F88AD',
        magenta '#d33682',
        violet '#6c71c4',
        cyant ''#2aa198,
        dark-cyan '#204052',
}
});

export type DarkThemeType = typeof darkTheme;

declare module "native-base" {
    interface ICustomTheme extends DarkThemeType {}
}

export default solarizedDarkTheme;

/*
Background: warmGray.500
Card: warmGray.700

 */
