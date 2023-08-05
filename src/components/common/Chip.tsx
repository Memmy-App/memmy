import { Box, Text } from "@src/components/common/Gluestack";
import React from "react";

interface IProps {
  text: string;
  color: string;
  variant?: "filled" | "outlined";
  fontSize?: "2xs" | "xs" | "sm";
  mx?: string | number;
  my?: string | number;
}

function Chip({
  text,
  color,
  variant = "filled",
  fontSize = "2xs",
  mx = "$1",
  my = "$0",
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
        size={fontSize}
        mx={mx as any}
        my={my as any}
      >
        {text}
      </Text>
    </Box>
  );
}

export default Chip;
