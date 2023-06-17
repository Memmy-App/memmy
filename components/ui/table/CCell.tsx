import React from "react";
import {Cell} from "react-native-tableview-simple";
import {useTheme} from "native-base";
import {CellInterface} from "react-native-tableview-simple/lib/typescript/components/Cell";

const CCell = (props: CellInterface) => {
    const theme = useTheme();

    return (
        <Cell
            backgroundColor={theme.colors.screen["700"]}
            titleTextColor={theme.colors.lightText}
            rightDetailColor={theme.colors.screen["400"]}
            {...props}
        />
    );
};

export default CCell;