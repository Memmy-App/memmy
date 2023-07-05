import React from "react";
import { Box, Text } from "native-base";
import { StyleSheet } from "react-native";

interface IProps {
  text: string;
  bgColor: string;
  textColor: string;
}

function Chip({ text, bgColor, textColor }: IProps) {
  return (
    <Box style={styles.chip} backgroundColor={bgColor}>
      <Text
        fontWeight="bold"
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

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderRadius: 10,
  },
});

export default Chip;
