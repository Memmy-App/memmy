import React, {useEffect} from "react";
import {VStack} from "native-base";

interface MarkdownBreakProps {
    children: React.ReactNode
}

const MarkdownWrapper = ({children}: MarkdownBreakProps) => {
    return (
        <VStack flex={1}>
            {children}
        </VStack>
    );
};

export default MarkdownWrapper;