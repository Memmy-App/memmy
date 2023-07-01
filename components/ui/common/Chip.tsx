import React from "react";
import { Box, Text, useTheme } from "native-base";

function Chip({ text, color }: { text: string; color?: string }) {
  const { colors } = useTheme();
  return (
    <Box
      style={{
        borderWidth: 1,
        borderRadius: 10,
        borderColor: color || colors.app.accent,
      }}
    >
      <Text
        fontWeight="medium"
        color={color || colors.app.accent}
        fontSize="2xs"
        mx={1}
        my={0.5}
      >
        {text}
      </Text>
    </Box>
  );
}

export default Chip;
