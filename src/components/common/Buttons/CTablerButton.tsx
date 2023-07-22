import React from "react";
import { Pressable } from "@components/common/Gluestack";

// eslint-disable-next-line import/no-extraneous-dependencies

interface CIconButtonProps {
  icon: any;
  onPress: () => void;
}

function CIconButton({ icon, onPress }: CIconButtonProps) {
  return <Pressable onPress={onPress}>{icon}</Pressable>;
}

export default CIconButton;
