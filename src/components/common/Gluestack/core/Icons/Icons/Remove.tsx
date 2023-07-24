import React from "react";
import { createIcon } from "@gluestack-ui/icon";
import { Path } from "react-native-svg";
import { Root } from "../styled-components";

export const RemoveIcon = createIcon({
  Root,
  viewBox: "0 0 24 24",
  path: (
    <>
      <Path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});
