import React from 'react';
import VStack from '@components/Common/Stack/VStack';

interface IProps {
  children: React.ReactNode;
  isFirst?: boolean;
  isLast?: boolean;
}

export default function CellContainer({
  children,
  isFirst,
  isLast,
}: IProps): React.JSX.Element {
  return (
    <VStack
      paddingHorizontal="$3"
      paddingVertical={12}
      backgroundColor="$fg"
      borderTopRightRadius={isFirst === true ? '$3' : undefined}
      borderTopLeftRadius={isFirst === true ? '$3' : undefined}
      borderBottomRightRadius={isLast === true ? '$3' : undefined}
      borderBottomLeftRadius={isLast === true ? '$3' : undefined}
    >
      {children}
    </VStack>
  );
}
