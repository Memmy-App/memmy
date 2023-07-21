import { Text } from "react-native";
import { styled } from "../../styled";

export default styled(
  Text,
  {
    color: "$textLight50",
    fontFamily: "$body",
  },
  { ancestorStyle: ["_text"] }
);
