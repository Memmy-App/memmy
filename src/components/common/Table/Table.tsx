import React, { Children } from "react";
import { Divider, Text, VStack } from "@src/components/gluestack";
import { View } from "react-native";
import { useThemeOptions } from "@src/state/settings/settingsStore";

interface IProps {
  header?: string;
  children: React.ReactNode;
}

function MTable({ header, children }: IProps): React.JSX.Element {
  const theme = useThemeOptions();
  const childrenArray = Children.toArray(children);

  return (
    <>
      <>
        {header && (
          <Text size="lg" fontWeight="semibold" pl="$1" mt="$3" mb="$1">
            {header}
          </Text>
        )}
        <VStack
          backgroundColor={theme.colors.fg}
          p="$3"
          borderRadius="$xl"
          space="md"
        >
          {childrenArray.map((child, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <View key={index}>
              {index !== 0 && <Divider backgroundColor={theme.colors.border} />}
              {child}
            </View>
          ))}
        </VStack>
      </>
    </>
  );
}

export const getTableStyles = (color: string): object => ({
  backgroundColor: color,
  padding: 3,
  borderRadius: 10,
});

export default MTable;
