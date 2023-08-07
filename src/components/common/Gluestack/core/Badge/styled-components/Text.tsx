import { Text } from "react-native";
import { styled } from "../../styled";

export default styled(
  Text,
  {
    fontWeight: "$extraBlack",
    fontFamily: "$body",
    textTransform: "uppercase",
  },
  { ancestorStyle: ["_text"] }
);
