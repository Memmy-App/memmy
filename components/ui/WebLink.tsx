import React from "react";
import {openLink} from "../../helpers/LinkHelper";
import {Pressable, Text} from "native-base";

interface WebLinkProps {
    href: string,
    children: React.ReactNode
}

const WebLink = ({href, children}: WebLinkProps) => {
    const onPress = () => {
        openLink(href);
    };

    return (
        <Pressable onPress={onPress}>
            <Text
                color={"blue.500"}
                underline={true}
                fontSize={"md"}
            >
                {children}
            </Text>
        </Pressable>
    );
};

export default WebLink;