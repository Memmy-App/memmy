import * as React from 'react';
import { Rect, SvgProps } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'tamagui';

interface IProps extends Partial<SvgProps> {
  size?: number;
}

function Ellipsis({ size = 22, ...rest }: IProps): React.JSX.Element {
  return (
    <View>
      <Ionicons name="ellipsis-horizontal" size={size} {...rest} />
      <Rect x="0" y="0" width="40" height="40" fill="rgba(0,0,0,0)" />
    </View>
  );
}

export default React.memo(Ellipsis);
