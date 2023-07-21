import { Pressable } from "react-native";
import { styled } from "../../styled";

export default styled(
  Pressable,
  {
    _web: {
      ":focusVisible": {
        outlineWidth: "2px",
        outlineColor: "$primary700",
        outlineStyle: "solid",
        _dark: {
          outlineColor: "$primary300",
        },
      },
    },
  },
  {}
);
