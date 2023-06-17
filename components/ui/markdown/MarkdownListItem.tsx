import React, {useEffect} from "react";
import {Text} from "native-base";

interface MarkdownListItemProps {
    children: React.ReactNode
}

const MarkdownListItem = ({ children }: MarkdownListItemProps) => {
    return (
        <Text>
            • {children}{"\n"}
        </Text>
    );
};

export default MarkdownListItem;