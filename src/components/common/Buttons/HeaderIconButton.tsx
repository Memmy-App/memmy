import { Pressable, useTheme } from "native-base";
import React from "react";

interface CIconButtonProps {
  icon: any;
  onPress?: () => void;
}

function HeaderIconButton({ icon, onPress }: CIconButtonProps) {
  const theme = useTheme();
  const iconElement = React.Children.only(icon);
  const newIconElement = React.cloneElement(iconElement, {
    color: theme.colors.app.accent,
  });
  const newPressedIconElement = React.cloneElement(iconElement, {
    color: theme.colors.app.accentHighlight,
  });

  return (
    <Pressable onPress={onPress}>
      {({ isPressed }) => (isPressed ? newPressedIconElement : newIconElement)}
    </Pressable>
  );
}

export default HeaderIconButton;
