import React from "react";
import {StyleSheet} from "react-native";
import {openLink} from "../helpers/LinkHelper";
import {ChevronRightIcon, HStack, Icon, Pressable, Spacer, Text} from "native-base";
import {Ionicons} from "@expo/vector-icons";
import {truncateLink} from "../helpers/TextHelper";

interface LinkButtonProps {
    link: string
}

const LinkButton = ({link}: LinkButtonProps) => {
    const onPress = () => {
        openLink(link).then();
    };

    return (
        <Pressable onPress={onPress}>
            <HStack
                backgroundColor={"gray.200"}
                borderRadius={5}
                padding={4}
                flexDirection={"row"}
                alignItems={"center"}
                space={2}
            >
                <Icon as={Ionicons} name={"link"} />
                <Spacer />
                <Text>
                    {truncateLink(link)}
                </Text>
                <Spacer />
                <ChevronRightIcon />
            </HStack>
        </Pressable>
    );
};

export default LinkButton;