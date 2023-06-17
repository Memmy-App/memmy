import React from "react";
import {Text, View} from "native-base";

interface MarkdownCodeProps {
    children: React.ReactNode
}

const MarkdownCode = ({children}: MarkdownCodeProps) => {
    return (
        <Text
            fontSize={"md"}
            mb={2}
            color={"white"}
            justifyContent={"center"}
            alignItems={"center"}
            fontFamily={"Courier"}
        >
            {children}
        </Text>
    );
};

export default MarkdownCode;