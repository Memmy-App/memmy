import React, {useEffect} from "react";
import {Heading, Spacer, Text} from "native-base";

interface MarkdownTextProps {
    children: React.ReactNode
}

const MarkdownText = ({children}: MarkdownTextProps) => {
    return (
        <Text
            fontSize={"md"}
            mb={2}
            color={"white"}
            justifyContent={"center"}
            alignItems={"center"}
        >
            {children}
        </Text>
    );
};

export default MarkdownText;