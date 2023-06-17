import React, {useRef, useState} from "react";
import {openLink} from "../../helpers/LinkHelper";
import {ChevronRightIcon, HStack, Icon, Pressable, Spacer, Text} from "native-base";
import {truncateImageLink, truncateLink} from "../../helpers/TextHelper";
import ImageModal, {ImageDetail} from "@dreamwalk-os/react-native-image-modal";
import FastImage from "react-native-fast-image";
import ImageModalScreen from "../screens/image/ImageModalScreen";
import {Dimensions} from "react-native";

interface ImageButtonProps {
    src: string
}

const ImageButton = ({src}: ImageButtonProps) => {
    const [visible, setVisible] = useState(false);

    const onPress = () => {
        setVisible(true);
        console.log("sup");
    };

    return (
        <>
            <Pressable onPress={onPress}>
                <HStack
                    backgroundColor={"screen.700"}
                    borderRadius={5}
                    padding={2}
                    flexDirection={"row"}
                    alignItems={"center"}
                    space={2}
                    my={4}
                    mx={5}
                >
                    <FastImage
                        style={{
                            height: 50,
                            width: 50,
                        }}
                        resizeMode={"contain"}
                        source={{
                            uri: src
                        }}
                    />
                    <Spacer />
                    <Text>
                        {truncateImageLink(src)}
                    </Text>
                    <Spacer />
                    <ChevronRightIcon />
                </HStack>
            </Pressable>

            <ImageDetail source={{uri: src}} origin={{
                x: Dimensions.get("window").width / 2,
                y: Dimensions.get("window").height / 2,
                width: 100,
                height: 100
            }} resizeMode={"contain"} swipeToDismiss={true} onClose={() => setVisible(false)} isOpen={visible} />
        </>
    );
};

export default ImageButton;