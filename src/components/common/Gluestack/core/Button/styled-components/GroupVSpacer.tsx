import { View } from "react-native";
import { styled } from "../../styled";

export default styled(
  View,
  {
    variants: {
      space: {
        xs: {
          h: "$1",
        },
        sm: {
          h: "$1.5",
        },
        md: {
          h: "$2",
        },
        lg: {
          h: "$3",
        },
        xl: {
          h: "$4",
        },
      },
    },
  },
  { ancestorStyle: ["_groupVSpacer"] }
);
