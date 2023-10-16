import React from 'react';
import MaterialTabs from 'react-native-material-tabs';
import { ScrollViewProps, StyleProp, TextStyle } from 'react-native';
import { ContentType } from 'react-native-material-tabs/src/components/Tab/Tab';
import { useTheme } from 'tamagui';

interface IProps extends Pick<ScrollViewProps, 'keyboardShouldPersistTaps'> {
  allowFontScaling?: boolean;
  selectedIndex?: number;
  barColor?: string;
  barHeight?: number;
  activeTextColor?: string;
  indicatorColor?: string;
  inactiveTextColor?: string;
  scrollable?: boolean;
  textStyle?: StyleProp<TextStyle>;
  activeTextStyle?: StyleProp<TextStyle>;
  items?: ContentType[];
  uppercase?: boolean;
  onChange?: (index: number) => void;
  indicatorHeight?: number;
}

export default function TopTabs(props: IProps): React.JSX.Element {
  const theme = useTheme();

  return (
    // @ts-expect-error - this is valid
    <MaterialTabs
      {...props}
      activeTextStyle={{ color: theme.color?.val }}
      barColor={theme.fg.val}
    />
  );
}
