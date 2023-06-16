import React from "react";
import {Cell} from "react-native-tableview-simple";
import {useTheme} from "native-base";

interface CCellProps {
    props: object,
}

const CCell = ({props}: CCellProps) => {
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