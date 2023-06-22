import React from "react";
import { Cell } from "react-native-tableview-simple";
import { useTheme } from "native-base";
import { CellInterface } from "react-native-tableview-simple/lib/typescript/components/Cell";

function CCell(props: CellInterface) {
  const theme = useTheme();

  return (
    <Cell
      backgroundColor={theme.colors.app.backgroundTricondary}
      titleTextColor={theme.colors.lightText}
      rightDetailColor={theme.colors.app.iconColor}
      {...props}
    />
  );
}

export default CCell;
