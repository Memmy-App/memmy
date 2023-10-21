import React from 'react';
import { View } from 'tamagui';

interface IProps {
  icon: React.ReactNode;
  bgColor: string;
}

function CellIcon({ icon, bgColor }: IProps): React.JSX.Element {
  return (
    <View
      height={28}
      width={28}
      borderRadius={8}
      backgroundColor={bgColor}
      justifyContent="center"
      alignItems="center"
      mr={8}
    >
      {React.cloneElement(icon as React.ReactElement, {
        color: 'white',
        size: 20,
      })}
    </View>
  );
}

export default React.memo(CellIcon);
