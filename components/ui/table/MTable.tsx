import React from "react";
import { Divider, Text, useTheme, VStack } from "native-base";

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
          <Text fontSize="lg" fontWeight="semibold" pl={1} mt={3} mb={1}>
            {header}
          </Text>
        )}
        <VStack
          backgroundColor={theme.colors.app.fg}
          p={3}
          borderRadius={10}
          space={3}
          divider={<Divider height={0.4} />}
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
