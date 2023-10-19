import React from 'react';
import { Button, ButtonProps } from 'react-native';
import { useTheme } from 'tamagui';

interface IProps extends ButtonProps {
  color?: string;
}

export default function HeaderButton({
  color,
  ...rest
}: IProps): React.JSX.Element {
  const theme = useTheme();

  return <Button color={color ?? theme.accent?.val} {...rest} />;
}
