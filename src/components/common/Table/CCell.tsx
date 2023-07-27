import React from "react";
import { Cell } from "@gkasdorf/react-native-tableview-simple";
import { Text } from "@src/components/common/Gluestack";
import { CellInterface } from "@gkasdorf/react-native-tableview-simple/lib/typescript/components/Cell";
import { useThemeOptions } from "@src/stores/settings/settingsStore";

function CCell(props: CellInterface) {
  const { title } = props;
  const theme = useThemeOptions();

  return (
    <Cell
      backgroundColor={theme.colors.fg}
      titleTextColor={theme.colors.textPrimary}
      rightDetailColor={theme.colors.textSecondary}
      {...props}
      title={typeof title === "string" ? <Text>{title}</Text> : title}
      highlightUnderlayColor={theme.colors.fg}
      leftDetailColor={theme.colors.fg}
      accessoryColor={theme.colors.fg}
    />
  );
}

export default CCell;
