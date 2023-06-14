import React, {useEffect, useState} from "react";
import {PostView} from "lemmy-js-client";
import {ExtensionType, getLinkInfo} from "../helpers/LinkHelper";
import {HStack, Pressable, Text} from "native-base";
import {truncatePost} from "../helpers/TextHelper";
import {Image} from "expo-image";
import ImageView from "react-native-image-viewing";
import LinkButton from "./LinkButton";
import {Dimensions, StyleSheet} from "react-native";
import {parseMarkdown} from "../helpers/MarkdownHelper";
import RenderHTML from "react-native-render-html";
import {Link} from "expo-router";

interface ContentViewProps {
    post: PostView,
    truncate?: boolean,
    alwaysShowBody?: boolean
}

const ContentView = ({post, truncate = false, alwaysShowBody = false}: ContentViewProps) => {
    const linkInfo = getLinkInfo(post.post.url);
    const [imageVisible, setImageVisible] = useState(false);

    const onImagePress = () => {
        setImageVisible(prev => !prev);
    };

    return (
        <>
            {
                linkInfo.extType === ExtensionType.IMAGE && (
                    <>
                        <Pressable onPress={onImagePress}>
                            <Image
                                source={{uri: post.post.url}}
                                style={styles.image}
                                cachePolicy={"disk"}
                                contentFit={"contain"}
                            />
                        </Pressable>
                        <ImageView
                            images={[{uri: post.post.url.toString()}]}
                            imageIndex={0}
                            visible={imageVisible}
                            onRequestClose={onImagePress}
                        />
                    </>
                )
            }

            {
                (linkInfo.extType === ExtensionType.NONE || alwaysShowBody) && (
                    <RenderHTML source={{
                        html: (truncate ? parseMarkdown(truncatePost(post.post.body)) : parseMarkdown(post.post.body)) ?? ""
                    }} contentWidth={Dimensions.get("window").width}/>
                )
            }

            {
                linkInfo.extType === ExtensionType.VIDEO && (
                    <LinkButton link={linkInfo.link} />
                ) || linkInfo.extType === ExtensionType.GENERIC && (
                    <LinkButton link={linkInfo.link} />
                )
            }

            <HStack>
                <Text>in </Text>
                <Link href={`/tabs/feeds/${post.community.id}`}>
                    <Text fontWeight={"bold"}>{post.community.name}</Text>
                </Link>
                <Text> by </Text>
                <Text fontWeight={"bold"}>{post.creator.name}</Text>
            </HStack>
        </>
    );
};

const styles = StyleSheet.create({
    image: {
        flex: 1,
        width: "100%",
        aspectRatio: 1
    },
});

export default ContentView;