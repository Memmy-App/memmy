// @ts-nocheck
import { ActivityIndicator } from "react-native";
import { styled } from "../../styled";

export default styled(
  ActivityIndicator,
  {
    props: {
      color: "$primary500",
    },
    _dark: {
      props: {
        color: "$primary400",
      },
    },
  },
  {
    resolveProps: ["color"],
  },
  {
    propertyTokenMap: {
      size: "size",
    },
  }
);
