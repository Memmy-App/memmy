import React from "react";
import { Box, Text, useTheme } from "native-base";

// TODO: build out
function Chip({ text, color }: { text: string; color?: string }) {
  const { colors } = useTheme();
  return (
    <Box
      style={{
        borderWidth: 1,
        borderRadius: 10,
        borderColor: color || colors.app.info,
      }}
    >
      <Text
        fontWeight="medium"
        color={color || colors.app.info}
        fontSize="2xs"
        mx={1}
      >
        {text}
      </Text>
    </Box>
  );
}

export default Chip;
