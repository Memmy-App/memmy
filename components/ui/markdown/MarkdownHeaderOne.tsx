import React from "react";
import {Text} from "native-base";

interface MarkdownHeaderOneProps {
    children: React.ReactNode
}

const MarkdownHeaderOne = ({children}: MarkdownHeaderOneProps) => {
    return (
        <Text
            fontSize={"2xl"}
            fontWeight={"bold"}
            mb={2}
        >
            {children}
        </Text>
    );
};

export default MarkdownHeaderOne;