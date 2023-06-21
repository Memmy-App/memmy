import { Box, HStack, Pressable, Text } from "native-base";
import React from "react";
import { GestureResponderEvent } from "react-native";
import { ColorType } from "native-base/lib/typescript/components/types";
import { IFontSize } from "native-base/lib/typescript/theme/base/typography";

interface IconButtonWithTextProps {
  onPressHandler: (event: GestureResponderEvent) => void;
  icon: JSX.Element;
  iconBgColor?: ColorType;
  text?: string | number;
  textColor?: ColorType;
  textSize?: IFontSize;
}

function IconButtonWithText({
  onPressHandler,
  icon,
  iconBgColor,
  text,
  textColor,
  textSize = "lg",
}: IconButtonWithTextProps) {
  return (
    <Pressable onPress={onPressHandler} hitSlop={5}>
      <HStack space={2}>
        <Box borderRadius={5} backgroundColor={iconBgColor} padding={0.5}>
          {icon}
        </Box>
        {text !== undefined && (
          <Text color={textColor} fontSize={textSize}>
            {text}
          </Text>
        )}
      </HStack>
    </Pressable>
  );
}

export default IconButtonWithText;
