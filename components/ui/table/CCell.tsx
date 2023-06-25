import React from "react";
import { Cell } from "react-native-tableview-simple";
import { useTheme } from "native-base";
import { CellInterface } from "react-native-tableview-simple/lib/typescript/components/Cell";

function CCell(props: CellInterface) {
  const theme = useTheme();

  return (
    <Cell
      backgroundColor={theme.colors.app.bgTertiary}
      titleTextColor={theme.colors.app.textPrimary}
      rightDetailColor={theme.colors.app.textSecondary}
      {...props}
    />
  );
}

export default CCell;
