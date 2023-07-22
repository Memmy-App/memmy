import React from "react";
import { Pressable, Text } from "@components/common/Gluestack";

interface IProps {
  bg: string;
  text: string;
  onPress: () => void | Promise<void>;
  onPressIn: () => void | Promise<void>;
  onPressOut: () => void | Promise<void>;
  [x: string]: any;
}

function Button({
  bg,
  text,
  onPress,
  onPressIn,
  onPressOut,
  ...props
}: IProps) {
  return (
    <Pressable
      hitSlop={5}
      backgroundColor={bg}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      {...props}
    >
      <Text>{text}</Text>
    </Pressable>
  );
}

export default Button;
