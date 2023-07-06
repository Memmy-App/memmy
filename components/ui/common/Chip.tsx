import { Box, Text } from "native-base";
import React from "react";

interface IProps {
  text: string;
  color: string;
  variant?: "filled" | "outlined";
}

function Chip({ text, color, variant = "filled" }: IProps) {
  const chipStyles = {
    borderWidth: 1,
    borderRadius: 10,
    ...(variant === "outlined"
      ? { borderColor: color }
      : { backgroundColor: color }),
  };

  const textColor = variant === "outlined" ? color : "#fff";
  const textWeight = variant === "outlined" ? "medium" : "bold";

  // else return filled
  return (
    <Box style={chipStyles} backgroundColor={color}>
      <Text
        fontWeight={textWeight}
        color={textColor}
        fontSize="2xs"
        mx={1.5}
        my={0.5}
      >
        {text}
      </Text>
    </Box>
  );
}

export default Chip;
