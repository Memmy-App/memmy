import React from "react";
import { useTheme } from "native-base";
import { Divider, Text, VStack } from "@components/common/Gluestack";

interface IProps {
  header?: string;
  children: React.ReactNode;
}

function MTable({ header, children }: IProps) {
  const theme = useTheme();

  return (
    <>
      <>
        {header && (
          <Text size="lg" fontWeight="semibold" pl="$1" mt="$3" mb="$1">
            {header}
          </Text>
        )}
        <VStack
          backgroundColor={theme.colors.app.fg}
          p="$3"
          borderRadius={10}
          space="md"
          divider={<Divider backgroundColor={theme.colors.app.border} />}
        >
          {children}
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
