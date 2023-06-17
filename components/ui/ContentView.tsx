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
import RenderMarkdown from "./markdown/RenderMarkdown";

interface ContentViewProps {
    post: PostView,
    truncate?: boolean,
    showBody?: boolean,
    showTitle?: boolean
}

const ContentView = ({post, truncate = false, showBody = false, showTitle = false}: ContentViewProps) => {
    const linkInfo = getLinkInfo(post.post.url);

    const theme = useTheme();

    const textColor = truncate ? theme.colors.gray[400] : theme.colors.white;
    //const body = truncate ? parseMarkdown(truncatePost(post.post.body, 200)) : parseMarkdown(post.post.body);
    const body = truncate ? truncatePost(post.post.body, 200) : post.post.body;

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
                    <Text fontSize={"xl"} fontWeight={"semibold"} mt={5} mx={4} mb={4}>
                        {post.post.name}
                    </Text>
                )
            }

            {
                (linkInfo.extType === ExtensionType.NONE || showBody) && (
                    <VStack px={4}>
                        <RenderMarkdown text={body} />
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