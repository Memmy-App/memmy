import { Input, InputProps } from 'tamagui';
import { useThemeColorScheme } from '@src/hooks';

// export default styled(
//   Input,
//   {
//     color: '$color',
//     borderColor: '$accent',
//     backgroundColor: '$fg',
//     size: '$3',
//   },
//   {
//     isInput: true,
//   },
// );

export default function TextInput(props: InputProps) {
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
      {...props}
    />
  );
}
