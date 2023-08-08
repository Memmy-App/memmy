import { View } from "react-native";
import { styled } from "../../styled";

export default styled(
  View,
  {
    variants: {
      size: {
        xxxs: {
          height: `$0`,
        },
        xxs: {
          height: `$0.5`,
        },
        xs: {
          height: `$1`,
        },
        smxs: {
          height: `$1.5`,
        },
        sm: {
          height: `$2`,
        },
        mdsm: {
          height: `$2.5`,
        },
        md: {
          height: `$3`,
        },
        lg: {
          height: `$4`,
        },
        xl: {
          height: `$5`,
        },
        "2xl": {
          height: `$6`,
        },
        "3xl": {
          height: `$7`,
        },
        "4xl": {
          height: `$8`,
        },
        "5xl": {
          height: `$9`,
        },
        "6xl": {
          height: `$10`,
        },
        "7xl": {
          height: `$11`,
        },
        "8xl": {
          height: `$12`,
        },
      },
    },
  },
  {}
);
