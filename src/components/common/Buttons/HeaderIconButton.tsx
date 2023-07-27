import { Pressable } from "@src/components/common/Gluestack";
import React from "react";
import { useThemeOptions } from "@src/stores/settings/settingsStore";

interface CIconButtonProps {
  icon: JSX.Element;
  onPress?: () => void;
}

function HeaderIconButton({ icon, onPress }: CIconButtonProps) {
  const theme = useThemeOptions();
  const iconElement = React.Children.only(icon);
  const newIconElement = React.cloneElement(iconElement, {
    color: theme.colors.accent,
  });
  const newPressedIconElement = React.cloneElement(iconElement, {
    color: theme.colors.accentHighlight,
  });

  return (
    <Pressable onPress={onPress}>
      {({ isPressed }) => (isPressed ? newPressedIconElement : newIconElement)}
    </Pressable>
  );
}

export default HeaderIconButton;
