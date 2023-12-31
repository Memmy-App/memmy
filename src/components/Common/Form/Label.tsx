import React from 'react';
import { Label as TamaguiLabel, styled, XStack } from 'tamagui';

const StyledLabel = styled(TamaguiLabel, {
  fontSize: 13,
});

interface IProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export default function Label({ children, icon }: IProps): React.JSX.Element {
  return (
    <XStack space="$1" alignItems="center">
      {icon != null && icon}
      <StyledLabel>{children}</StyledLabel>
    </XStack>
  );
}
