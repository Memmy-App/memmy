import React, {useState} from "react";
import {PostView} from "lemmy-js-client";
import {ExtensionType, getLinkInfo} from "../helpers/LinkHelper";
import {Pressable, Text} from "native-base";
import {truncatePost} from "../helpers/TextHelper";
import {Image} from "expo-image";
import ImageView from "react-native-image-viewing";
import LinkButton from "./LinkButton";
import {StyleSheet} from "react-native";

interface ContentViewProps {
    post: PostView
}

const ContentView = ({post}: ContentViewProps) => {
    const linkInfo = getLinkInfo(post.post.url);
    const [imageVisible, setImageVisible] = useState(false);

    const onImagePress = () => {
        setImageVisible(prev => !prev);
    };

    if(linkInfo.extType === ExtensionType.NONE) {
        return (
            <Text fontSize={"md"}>{truncatePost(post.post.body) ?? ""}</Text>
        );
    } else if(linkInfo.extType === ExtensionType.IMAGE) {
        return (
            <>
                <Pressable onPress={onImagePress}>
                    <Image
                        source={{uri: post.post.url}}
                        style={styles.image}
                        cachePolicy={"disk"}
                    />
                </Pressable>
                <ImageView
                    images={[{uri: post.post.url.toString()}]}
                    imageIndex={0}
                    visible={imageVisible}
                    onRequestClose={onImagePress}
                />
            </>
        );
    } else if(linkInfo.extType === ExtensionType.VIDEO) {
        return <LinkButton link={linkInfo.link} />;
    } else {
        return <LinkButton link={linkInfo.link} />;
    }
};

const styles = StyleSheet.create({
    image: {
        flex: 1,
        width: "100%",
        aspectRatio: 1
    },
});

export default ContentView;