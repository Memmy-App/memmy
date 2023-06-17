import React from "react";
import {View} from "native-base";

interface MarkdownPreProps {
    children: React.ReactNode
}

const MarkdownPre = ({children}: MarkdownPreProps) => {
    return (
        <View
            flex={1}
            backgroundColor={"screen.700"}
            p={2}
            borderRadius={5}
        >
            {children}

        </View>
    );
};

export default MarkdownPre;