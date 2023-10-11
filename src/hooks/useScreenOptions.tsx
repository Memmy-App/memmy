import { useTheme } from 'tamagui';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export const useScreenOptions = (): NativeStackNavigationOptions => {
  const theme = useTheme();

  return {
    headerStyle: {
      backgroundColor: theme.fg.val,
    },
    headerTitleStyle: {
      color: theme.color.val,
    },
    contentStyle: {
      backgroundColor: theme.bg.val,
    },
  };
};
