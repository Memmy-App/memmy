import React, {useState} from "react";
import {Pressable, Text} from "native-base";

interface MarkdownDetailsProps {
    children: React.ReactNode
}

const MarkdownDetails = ({children}: MarkdownDetailsProps) => {
    const [visible, setVisible] = useState(false);

    const onPress = () => {
        setVisible(prev => !prev);
    }

    return (
        <Pressable
            onPress={onPress}
            backgroundColor={"screen.700"}
        >
            <Text
                fontSize={"md"}
                mb={2}
                color={visible ? "white" : "screen.700"}
                justifyContent={"center"}
                alignItems={"center"}
            >
                {children}
            </Text>
        </Pressable>
    );
};

export default MarkdownDetails;