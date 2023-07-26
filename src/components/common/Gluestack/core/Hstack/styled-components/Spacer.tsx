import { View } from "react-native";
import { styled } from "../../styled";

export default styled(
  View,
  {
    variants: {
      size: {
        xxxs: {
          width: `$0`,
        },
        xxs: {
          width: `$0.5`,
        },
        xs: {
          width: `$1`,
        },
        smxs: {
          width: `$1.5`,
        },
        sm: {
          width: `$2`,
        },
        mdsm: {
          width: `$2.5`,
        },
        md: {
          width: `$3`,
        },
        lg: {
          width: `$4`,
        },
        xl: {
          width: `$5`,
        },
        "2xl": {
          width: `$6`,
        },
        "3xl": {
          width: `$7`,
        },
        "4xl": {
          width: `$8`,
        },
        "5xl": {
          width: `$9`,
        },
        "6xl": {
          width: `$10`,
        },
        "7xl": {
          width: `$11`,
        },
        "8xl": {
          width: `$12`,
        },
      },
    },
  },
  {}
);
