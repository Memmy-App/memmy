import React from "react";
import {Text, VStack} from "native-base";

interface MarkdownListProps {
    children: React.ReactNode
}

const MarkdownList = ({ children }: MarkdownListProps) => {
    return (
        <VStack flex={1} pl={2}>
            {children}
        </VStack>
    );
};

export default MarkdownList;