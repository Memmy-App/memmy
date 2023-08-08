import { ActivityIndicator } from "react-native";
import { styled } from "../../styled";

export default styled(
  ActivityIndicator,
  {},
  { ancestorStyle: ["_spinner"], resolveProps: ["color"] }
);
