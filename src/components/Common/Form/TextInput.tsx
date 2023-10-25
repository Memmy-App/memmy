import React from 'react';
import { Input, InputProps } from 'tamagui';
import { useThemeColorScheme } from '@src/hooks';

function TextInput(props: InputProps, ref: any): React.JSX.Element {
  const colorScheme = useThemeColorScheme();

  return (
    <Input
      borderRadius={0}
      borderWidth={0}
      backgroundColor="$fg"
      placeholderTextColor="$secondary"
      color="$color"
      cursorColor="$accent"
      keyboardAppearance={colorScheme}
      ref={ref}
      {...props}
    />
  );
}

export default React.forwardRef<InputProps>(TextInput);
