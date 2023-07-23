import { Pressable } from "@components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";
import React from "react";

interface CIconButtonProps {
  icon: JSX.Element;
  onPress?: () => void;
}

function HeaderIconButton({ icon, onPress }: CIconButtonProps) {
  const theme = useAppSelector(selectThemeOptions);
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
