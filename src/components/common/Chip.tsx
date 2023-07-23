import { Box, Text } from "native-base";
import React from "react";

interface IProps {
  text: string;
  color: string;
  variant?: "filled" | "outlined";
  fontSize?: "2xs" | "xs" | "sm";
  mx?: number;
  my?: number;
}

function Chip({
  text,
  color,
  variant = "filled",
  fontSize = "2xs",
  mx = 1.5,
  my = 0.5,
}: IProps) {
  const chipStyles = {
    borderWidth: 1,
    borderRadius: 10,
    ...(variant === "outlined"
      ? { borderColor: color }
      : { backgroundColor: color, borderColor: "transparent" }),
  };

  const textColor = variant === "outlined" ? color : "#fff";
  const textWeight = variant === "outlined" ? "medium" : "bold";

  // else return filled
  return (
    <Box style={chipStyles}>
      <Text
        fontWeight={textWeight}
        color={textColor}
        fontSize={fontSize}
        mx={mx}
        my={my}
      >
        {text}
      </Text>
    </Box>
  );
}

export default Chip;
