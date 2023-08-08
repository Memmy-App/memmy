import { AsForwarder } from "@gluestack-style/react";
import { styled } from "../../styled";

const Icon = styled(AsForwarder, {}, {});

export default styled(
  Icon,
  {},
  {
    ancestorStyle: ["_icon"],
  },
  {
    propertyTokenMap: {
      stroke: "colors",
    },
  }
);
