import React, { NamedExoticComponent, useMemo } from 'react';
import { styled } from 'tamagui';

interface IProps {
  icon: NamedExoticComponent;
  color?: string;
}

function ContextMenuButton({
  icon,
  color = '$accent',
}: IProps): React.JSX.Element {
  const Icon = useMemo(
    () =>
      styled(icon, {
        // @ts-expect-error This is valid
        color,
        size: 26,
      }),
    [icon],
  );

  return <Icon />;
}

export default React.memo(ContextMenuButton);
