import React from "react";
import { Cell } from "@gkasdorf/react-native-tableview-simple";
import { Text } from "@components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";
import { CellInterface } from "@gkasdorf/react-native-tableview-simple/lib/typescript/components/Cell";

function CCell(props: CellInterface) {
  const { title } = props;
  const theme = useAppSelector(selectThemeOptions);

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
