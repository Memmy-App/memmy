import React from 'react';
import VStack from '@components/Common/Stack/VStack';
import { Text } from 'tamagui';

interface IProps {
  header?: string;
  footer?: string;
  children: React.ReactNode;
}

export default function Section({ header, footer, children }: IProps): React.JSX.Element {
  return (
    <VStack>
      {
        header != null && (
          <Text
            color="$secondary"
            paddingHorizontal="$3"
            paddingVertical="$2"
            fontSize={12}
          >
            {header.toUpperCase()}
          </Text>
        )
      }

      {
        React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              ...child.props,
              isFirst: index === 0,
              isLast: !Array.isArray(children) || index === children.length - 1,
            });
          }

          return null;
        })
      }

      {
        footer != null && (
          <Text
            color="$secondary"
            paddingHorizontal="$3"
            paddingVertical="$2"
            fontSize={12}
          >
            {footer}
          </Text>
        )
      }
    </VStack>
  );
}
