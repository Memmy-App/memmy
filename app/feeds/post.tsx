import React, {useEffect, useState} from "react";
import {CommentReplyView, CommentView, Post, PostView} from "lemmy-js-client";
import {Stack, useRouter, useSearchParams} from "expo-router";
import {isInitialized, lemmyInstance} from "../../lemmy/LemmyInstance";
import LoadingView from "../../ui/LoadingView";
import {
    ArrowDownIcon,
    ArrowUpIcon, Center,
    Divider, FlatList,
    HStack,
    Icon,
    IconButton,
    ScrollView, SectionList, Spinner,
    Text,
    View,
    VStack
} from "native-base";
import {Dimensions, StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import moment from "moment/moment";
import ILemmyComment from "../../lemmy/types/ILemmyComment";
import CommentItem from "../../ui/CommentItem";
import LemmyCommentsHelper from "../../lemmy/LemmyCommentsHelper";
import RenderHTML from "react-native-render-html";
import {parseMarkdown} from "../../helpers/MarkdownHelper";
import {FlashList} from "@shopify/flash-list";

const PostScreen = () => {
    const [post, setPost] = useState<PostView | null>(null);
    const [comments, setComments] = useState<ILemmyComment[] | null>(null);

    const {postId} = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        if(!isInitialized()) {
            router.back();
            return;
        }

        load().then();
    }, []);

    const load = async () => {
        const postRes = await lemmyInstance.getPost({
            id: Number(postId)
        });

        setPost(postRes.post_view);

        const commentsRes = await lemmyInstance.getComments({
            post_id: Number(postId),
            max_depth: 15,
            type_: "All"
        });

        const helper = new LemmyCommentsHelper(commentsRes.comments);

        const parsed = helper.getParsed();

        setComments(parsed);
    };

    const commentItem = ({item}: {item: ILemmyComment}) => {

        return (
            <View style={styles.container}>
                <CommentItem comment={item} />
            </View>
        );
    };

    if(!post) {
        return <LoadingView />;
    }

    const header = () => (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: `${post.counts.comments} Comment${post.counts.comments !== 1 ? "s" : ""}`
                }}
            />
            <Text fontSize={"2xl"}>{post.post.name}</Text>
            <VStack>
                <Text fontSize={"sm"}>
                    <RenderHTML source={{
                        html: parseMarkdown(post.post.body)
                    }} contentWidth={100}/>
                </Text>
            </VStack>
            <HStack mt={2}>
                <Text>in </Text>
                <Text fontWeight={"bold"}>{post.community.name} </Text>
                <Text>by </Text>
                <Text fontWeight={"bold"}>{post.creator.name}</Text>
            </HStack>
            <HStack mt={2} space={3} alignItems={"center"}>
                <HStack space={1} alignItems={"center"}>
                    {
                        post.counts.score >= 0 ? (
                            <ArrowUpIcon />
                        ) : (
                            <ArrowDownIcon />
                        )
                    }
                    <Text color={"gray.500"}>{post.counts.score}</Text>
                </HStack>

                <HStack space={1} alignItems={"center"}>
                    <Icon as={Ionicons} name={"chatbubble-outline"} />
                    <Text color={"gray.500"}>{post.counts.comments}</Text>
                </HStack>

                <HStack space={1} alignItems={"center"}>
                    <Icon as={Ionicons} name={"time-outline"} />
                    <Text color={"gray.500"}>{moment(post.post.published).utc(true).fromNow()}</Text>
                </HStack>
            </HStack>
            <Divider my={1} />
            <HStack justifyContent={"center"} space={10}>
                <IconButton icon={<Icon as={Ionicons} name={"arrow-up-outline"} />} />
                <IconButton icon={<Icon as={Ionicons} name={"arrow-down-outline"} />} />
                <IconButton icon={<Icon as={Ionicons} name={"bookmark-outline"} />} />
                <IconButton icon={<Icon as={Ionicons} name={"arrow-undo-outline"} />} />
                <IconButton icon={<Icon as={Ionicons} name={"share-outline"} />} />
            </HStack>
        </View>
    );

    const footer = () => {
        if(!comments) {
            return (
                <Center mt={8}>
                    <Spinner />
                    <Text fontStyle={"italic"} color={"gray.500"}>Loading comments...</Text>
                </Center>
            );
        }

        if(comments.length === 0) {
            return (
                <Center mt={8}>
                    <Text fontStyle={"italic"} color={"gray.500"}>No comments yet :(</Text>
                </Center>
            );
        }
    };



    return (
        <View style={styles.container}>
            <FlashList
                ListFooterComponent={footer}
                ListHeaderComponent={header}
                data={comments}
                renderItem={commentItem}
                keyExtractor={(item) => item.top.comment.id.toString()}
                estimatedItemSize={300}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 10
    },
});

export default PostScreen;