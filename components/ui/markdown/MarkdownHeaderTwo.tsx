import React, {useEffect} from "react";
import {Divider, Heading, HStack, Spacer, Text, View, VStack} from "native-base";

interface MarkdownHeaderOneProps {
    children: React.ReactNode
}

const MarkdownHeaderTwo = ({children}: MarkdownHeaderOneProps) => {
    return (
        <Heading
            fontSize={"xl"}
            fontWeight={"bold"}
            mb={2}
        >
            {children}
        </Heading>
    );
};

export default MarkdownHeaderTwo;