import React, {useEffect, useState} from "react";
import {PostView} from "lemmy-js-client";
import {ExtensionType, getLinkInfo} from "../helpers/LinkHelper";
import {HStack, Pressable, Text, View} from "native-base";
import {truncatePost} from "../helpers/TextHelper";
import LinkButton from "./LinkButton";
import {Dimensions, StyleSheet} from "react-native";
import {parseMarkdown} from "../helpers/MarkdownHelper";
import RenderHTML from "react-native-render-html";
import {Link} from "expo-router";
import ImageModal from "react-native-image-modal";
import FastImage from "react-native-fast-image";

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
                    <View style={styles.imageContainer}>
                        {/*<Pressable onPress={onImagePress}>*/}
                        {/*    <Image*/}
                        {/*        source={{uri: post.post.url}}*/}
                        {/*        style={styles.image}*/}
                        {/*        cachePolicy={"disk"}*/}
                        {/*        contentFit={"contain"}*/}
                        {/*    />*/}
                        {/*</Pressable>*/}
                        <ImageModal
                            isTranslucent={true}
                            swipeToDismiss={true}
                            resizeMode={"contain"}
                            style={styles.image}
                            source={{
                                uri: post.post.url
                            }}
                        />

                    </View>
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
    imageContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: Dimensions.get("screen").width - 25,
        height: 250
    },
});

export default ContentView;