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
    ScrollView, Spinner,
    Text,
    View,
    VStack
} from "native-base";
import {StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import moment from "moment/moment";
import ILemmyComment from "../../lemmy/types/ILemmyComment";
import CommentItem from "../../ui/CommentItem";
import LemmyCommentsHelper from "../../lemmy/LemmyCommentsHelper";

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
            <>
                <CommentItem comment={item} />
            </>
        );
    };

    if(!post) {
        return <LoadingView />;
    }


    return (
        <ScrollView style={styles.container}>
            <Stack.Screen
                options={{
                    title: `${post.counts.comments} Comment${post.counts.comments !== 1 ? "s" : ""}`
                }}
            />
            <Text fontSize={"2xl"}>{post.post.name}</Text>
            <VStack style={styles.body}>
                <Text fontSize={"sm"}>
                    {post.post.body}
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
            <Divider />
            <VStack style={styles.comments}>
                {
                    !comments && (
                        <>
                            <Text textAlign={"center"} alignSelf={"center"} justifyContent={"center"} mt={10}>
                                Loading comments...
                            </Text>
                            <Spinner mt={4} />
                        </>
                    ) || comments.length === 0 && (
                        <Text textAlign={"center"} alignSelf={"auto"} mt={10}>
                            No comments yet :(
                        </Text>
                    ) || (
                        <FlatList data={comments} renderItem={commentItem} />
                    )
                }
            </VStack>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "white"
    },

    body: {

    },

    comments: {

    }
});

export default PostScreen;