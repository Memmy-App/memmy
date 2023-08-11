import { Pressable } from "@src/components/gluestack";
import React, { useMemo } from "react";
import { useThemeOptions } from "@src/state/settings/settingsStore";
import { SFIcon } from "@src/components/common/icons/SFIcon";

interface CIconButtonProps {
  icon: string;
  onPress?: () => void;
}

function HeaderIconButton({
  icon,
  onPress,
}: CIconButtonProps): React.JSX.Element {
  const theme = useThemeOptions();
  const iconElement = useMemo(() => <SFIcon icon={icon} />, [icon]);
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

export default React.memo(HeaderIconButton);
