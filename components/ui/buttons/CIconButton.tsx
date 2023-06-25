import React from "react";
import { Icon, Pressable } from "native-base";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Ionicons } from "@expo/vector-icons";

interface CIconButtonProps {
  name: string;
  onPress: () => void;
}

function CIconButton({ name, onPress }: CIconButtonProps) {
  return (
    <Pressable onPress={onPress}>
      <Icon as={Ionicons} name={name} color="#007AFF" size={6} ml={2} />
    </Pressable>
  );
}

export default CIconButton;
