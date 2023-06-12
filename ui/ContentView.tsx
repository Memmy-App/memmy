import React, {useState} from "react";
import {PostView} from "lemmy-js-client";
import {ExtensionType, getLinkInfo} from "../helpers/LinkHelper";
import {Pressable} from "native-base";
import {truncatePost} from "../helpers/TextHelper";
import {Image} from "expo-image";
import ImageView from "react-native-image-viewing";
import LinkButton from "./LinkButton";
import {Dimensions, StyleSheet} from "react-native";
import {parseMarkdown} from "../helpers/MarkdownHelper";
import RenderHTML from "react-native-render-html";

interface ContentViewProps {
    post: PostView,
    truncate?: boolean
}

const ContentView = ({post, truncate = false}: ContentViewProps) => {
    const linkInfo = getLinkInfo(post.post.url);
    const [imageVisible, setImageVisible] = useState(false);

    const onImagePress = () => {
        setImageVisible(prev => !prev);
    };

    if(linkInfo.extType === ExtensionType.NONE) {
        return (
            <RenderHTML source={{
                html: (truncate ? parseMarkdown(truncatePost(post.post.body)) : parseMarkdown(post.post.body)) ?? ""
            }} contentWidth={Dimensions.get("window").width}/>
        );
    } else if(linkInfo.extType === ExtensionType.IMAGE) {
        return (
            <>
                <Pressable onPress={onImagePress}>
                    <Image
                        source={{uri: post.post.thumbnail_url}}
                        style={styles.image}
                        cachePolicy={"disk"}
                        resizeMode={"contain"}
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