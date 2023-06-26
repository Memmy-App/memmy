import React from "react";
import {Pressable, useTheme} from "native-base";

// eslint-disable-next-line import/no-extraneous-dependencies

interface CIconButtonProps {
  icon: any;
  onPress: () => void;
}

function HeaderIconButton({ icon, onPress }: CIconButtonProps) {
  const theme = useTheme();
  const iconElement = React.Children.only(icon);
  const newIconElement = React.cloneElement(iconElement, {
    color: theme.colors.app.accent,
  });
  return <Pressable onPress={onPress}>{newIconElement}</Pressable>;
}

export default HeaderIconButton;
