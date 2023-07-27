import React, { Children } from "react";
import { Divider, Text, VStack } from "@src/components/common/Gluestack";
import { useThemeOptions } from "@src/stores/settings/settingsStore";

interface IProps {
  header?: string;
  children: React.ReactNode;
}

function MTable({ header, children }: IProps) {
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
            <>
              {index !== 0 && <Divider backgroundColor={theme.colors.border} />}
              {child}
            </>
          ))}
        </VStack>
      </>
    </>
  );
}

export const getTableStyles = (color: string) => ({
  backgroundColor: color,
  padding: 3,
  borderRadius: 10,
});

export default MTable;
