import React from "react";
import {PostView} from "lemmy-js-client";
import {ExtensionType, getLinkInfo} from "../../helpers/LinkHelper";
import {Text, useTheme, VStack} from "native-base";
import {truncatePost} from "../../helpers/TextHelper";
import LinkButton from "./LinkButton";
import {Dimensions, StyleSheet} from "react-native";
import {parseMarkdown} from "../../helpers/MarkdownHelper";
import RenderHTML from "react-native-render-html";
import ImageModal from "react-native-image-modal";

interface ContentViewProps {
    post: PostView,
    truncate?: boolean,
    showBody?: boolean,
    showTitle?: boolean
}

const ContentView = ({post, truncate = false, showBody = false, showTitle = false}: ContentViewProps) => {
    const linkInfo = getLinkInfo(post.post.url);

    const theme = useTheme();

    return (
        <>
            {
                linkInfo.extType === ExtensionType.IMAGE && (
                    <VStack mb={3}>
                        <ImageModal
                            isTranslucent={true}
                            swipeToDismiss={true}
                            resizeMode={"contain"}
                            style={styles.image}
                            source={{
                                uri: post.post.url
                            }}
                            imageBackgroundColor={theme.colors.screen["700"]}
                        />
                    </VStack>
                )
            }

            {
                showTitle && (
                    <Text fontSize={"xl"} mx={4} mb={2}>
                        {post.post.name}
                    </Text>
                )
            }

            {
                (linkInfo.extType === ExtensionType.NONE || showBody) && (
                    <VStack px={4}>
                        <RenderHTML source={{
                            html: "<div style=\"color: white; font-size: 16px\">" + (truncate ? parseMarkdown(truncatePost(post.post.body)) : parseMarkdown(post.post.body)) + "</div>" ?? ""
                        }} contentWidth={Dimensions.get("window").width}/>
                    </VStack>
                )
            }

            {
                linkInfo.extType === ExtensionType.VIDEO && (
                    <LinkButton link={linkInfo.link} />
                ) || linkInfo.extType === ExtensionType.GENERIC && (
                    <LinkButton link={linkInfo.link} />
                )
            }
        </>
    );
};

const styles = StyleSheet.create({
    image: {
        height: 350,
        width: Dimensions.get("screen").width
    },
});

export default ContentView;