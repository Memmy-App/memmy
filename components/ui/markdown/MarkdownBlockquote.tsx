import React from "react";
import {View} from "native-base";

interface MarkdownBlockquoteProps {
    children: React.ReactNode
}

const MarkdownBlockquote = ({children}: MarkdownBlockquoteProps) => {
    return (
        <View
            flex={1}
            backgroundColor={"screen.700"}
            px={2}
            py={1}
            borderLeftWidth={3}
            borderLeftColor={"orange.300"}
            borderRadius={5}
        >
            {children}
        </View>
    );
};

export default MarkdownBlockquote;