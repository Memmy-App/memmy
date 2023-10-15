import React, { NamedExoticComponent, useMemo } from 'react';
import { styled } from 'tamagui';

interface IProps {
  icon: NamedExoticComponent;
}

function ContextMenuButton({ icon }: IProps): React.JSX.Element {
  const Icon = useMemo(
    () =>
      styled(icon, {
        // @ts-expect-error This is valid
        color: '$accent',
        size: 26,
      }),
    [icon],
  );

  return <Icon />;
}

export default React.memo(ContextMenuButton);
