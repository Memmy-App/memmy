/* eslint-disable global-require */

export type AppIconType =
  | "purple"
  | "blue"
  | "red"
  | "green"
  | "yellow"
  | "brown"
  | "pink"
  | "darkgray"
  | "lightgray"
  | "orange"
  | "pride"
  | "pridenew"
  | "transpride";

export const appIconOptions: Record<
  AppIconType,
  { display: string; path: any }
> = {
  purple: {
    display: "Purple (Default)",
    path: require("../../ios/purple-29.png"),
  },
  blue: { display: "Blue", path: require("../../ios/blue-29.png") },
  red: { display: "Red", path: require("../../ios/red-29.png") },
  green: {
    display: "Green",
    path: require("../../ios/green-29.png"),
  },
  yellow: {
    display: "Yellow",
    path: require("../../ios/yellow-29.png"),
  },
  pink: { display: "Pink", path: require("../../ios/pink-29.png") },
  orange: {
    display: "Orange",
    path: require("../../ios/orange-29.png"),
  },
  lightgray: {
    display: "Light Gray",
    path: require("../../ios/lightgray-29.png"),
  },
  darkgray: {
    display: "Dark Gray",
    path: require("../../ios/darkgray-29.png"),
  },
  brown: {
    display: "Brown",
    path: require("../../ios/brown-29.png"),
  },
  pride: {
    display: "Pride",
    path: require("../../ios/pride-29.png"),
  },
  pridenew: {
    display: "Pride (New)",
    path: require("../../ios/pridenew-29.png"),
  },
  transpride: {
    display: "Trans Pride",
    path: require("../../ios/transpride-29.png"),
  },
};
