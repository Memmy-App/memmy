import React, {useEffect} from "react";
import FastImage from "react-native-fast-image";
import {Dimensions} from "react-native";
import ImageModal from "react-native-image-modal";
import {Text} from "native-base";

interface MarkdownImageProps {
    src: string,
    alt: string
    title?: string
}

const MarkdownImage = ({src, alt, title}: MarkdownImageProps) => {
    useEffect(() => {
        console.log("MarkdownImage: " + src);
    }, []);

    return (
        <ImageModal
            source={{uri: src}}
            style={{
                width: Dimensions.get("window").width - 20,
                height: 200,
                borderRadius: 10,
                marginBottom: 10
            }}
            resizeMode={FastImage.resizeMode.contain}
        />
    );
};

export default MarkdownImage;