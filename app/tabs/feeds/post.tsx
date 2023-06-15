import React, {useEffect, useState} from "react";
import {Stack, useRouter} from "expo-router";
import {lemmyAuthToken, lemmyInstance} from "../../../lemmy/LemmyInstance";
import LoadingView from "../../../ui/LoadingView";
import {
    ArrowDownIcon,
    ArrowUpIcon,
    Center,
    Divider,
    HStack,
    Icon,
    IconButton,
    Spinner,
    Text,
    useTheme,
    View,
    VStack,
} from "native-base";
import {RefreshControl, StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import moment from "moment/moment";
import ILemmyComment from "../../../lemmy/types/ILemmyComment";
import CommentItem from "../../../ui/CommentItem";
import LemmyCommentsHelper from "../../../lemmy/LemmyCommentsHelper";
import {FlashList} from "@shopify/flash-list";
import {trigger} from "react-native-haptic-feedback";
import {clearPost, selectPost, setPostVote} from "../../../slices/post/postSlice";
import {useAppDispatch, useAppSelector} from "../../../store";
import {setResponseTo} from "../../../slices/newComment/newCommentSlice";
import ContentView from "../../../ui/ContentView";
import {setUpdateVote} from "../../../slices/feed/feedSlice";
import {getBaseUrl} from "../../../helpers/LinkHelper";
import CommunityLink from "../../../ui/CommunityLink";

const PostScreen = () => {
    const [comments, setComments] = useState<ILemmyComment[] | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const {post, newComment} = useAppSelector(selectPost);

    const router = useRouter();

    const dispatch = useAppDispatch();
    const theme = useTheme();

    useEffect(() => {
        load().then();

        return () => {
            dispatch(clearPost());
        };
    }, []);

    useEffect(() => {
        if(newComment) {
            const lComment: ILemmyComment = {
                top: newComment.comment,
                replies: []
            };

            if(newComment.isTopComment) {
                setComments([lComment, ...comments]);
            } else {
                const newChain = LemmyCommentsHelper.findAndAdd(comments, lComment);
                setComments(newChain);
                setRefresh(!refresh);
            }
        }
    }, [newComment]);

    const load = async () => {
        const commentsRes = await lemmyInstance.getComments({
            auth: lemmyAuthToken,
            post_id: post.post.id,
            max_depth: 15,
            type_: "All",
            sort: "Top"
        });

        const helper = new LemmyCommentsHelper(commentsRes.comments);
        const parsed = helper.getParsed();

        setComments(parsed);
        setRefreshing(false);
    };

    const commentItem = ({item}: {item: ILemmyComment}) => {
        return (
            <View style={styles.commentContainer}>
                <CommentItem comment={item} />
            </View>
        );
    };

    const onVotePress = async (value: -1 | 0 | 1) => {
        if(value === post.my_vote && value !== 0) value = 0;

        const oldValue = post.my_vote;

        dispatch(setPostVote(value));
        dispatch(setUpdateVote({
            postId: post.post.id,
            vote: value
        }));

        trigger("impactMedium");

        try {
            await lemmyInstance.likePost({
                auth: lemmyAuthToken,
                post_id: post.post.id,
                score: value
            });
        } catch(e) {
            dispatch(setPostVote(oldValue as -1|0|1));
            return;
        }
    };

    const onCommentPress = () => {
        dispatch(setResponseTo({
            post: post
        }));

        router.push({pathname: "/tabs/feeds/commentModal", params: {postId: post.post.id}});
    };

    const onRefresh = () => {
        setRefreshing(true);
        load().then();
    };

    const refreshControl = <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor={theme.colors.screen[300]}
    />;

    if(!post) {
        return <LoadingView />;
    }

    const header = () => (
        <VStack flex={1} backgroundColor={"screen.800"}>
            <Stack.Screen
                options={{
                    title: `${post.counts.comments} Comment${post.counts.comments !== 1 ? "s" : ""}`
                }}
            />

            <ContentView post={post} showBody={true} showTitle={true} />

            <HStack mx={4} mb={1}>
                <Text>in </Text>
                <CommunityLink community={post.community} />
                <Text> by </Text>
                <Text fontWeight={"bold"}>{post.creator.name}</Text>

                <Text fontSize={"sm"} fontStyle={"italic"} mx={4} mt={-1} color={"screen.400"} alignSelf={"flex-end"}>
                    {post.post.url && getBaseUrl(post.post.url)}
                </Text>
            </HStack>
            <HStack mx={3} space={2} alignItems={"center"} mb={3}>
                <HStack space={1} alignItems={"center"}>
                    {
                        (post.counts.upvotes - post.counts.downvotes) >= 0 ? (
                            <ArrowUpIcon />
                        ) : (
                            <ArrowDownIcon />
                        )
                    }
                    <Text>{post.counts.upvotes - post.counts.downvotes}</Text>
                </HStack>
                <HStack space={1} alignItems={"center"}>
                    <Icon as={Ionicons} name={"chatbubble-outline"} />
                    <Text>{post.counts.comments}</Text>
                </HStack>
                <HStack space={1} alignItems={"center"}>
                    <Icon as={Ionicons} name={"time-outline"} />
                    <Text>{moment(post.post.published).utc(true).fromNow()}</Text>
                </HStack>
            </HStack>
            <Divider my={1} />
            <HStack justifyContent={"center"} space={10} mb={2}>
                <IconButton
                    icon={
                        <Icon
                            as={Ionicons}
                            name={"arrow-up-outline"}
                            size={6}
                            onPress={() => onVotePress(1)}
                            color={post.my_vote === 1 ? "white" : "blue.500"}
                        />
                    }
                    backgroundColor={post.my_vote !== 1 ? "screen.800" : "green.500"}
                    padding={2}
                />
                <IconButton
                    icon={
                        <Icon
                            as={Ionicons}
                            name={"arrow-down-outline"}
                            size={6}
                            onPress={() => onVotePress(-1)}
                            color={post.my_vote === -1 ? "white" : "blue.500"}
                        />
                    }
                    backgroundColor={post.my_vote !== -1 ? "screen.800" : "orange.500"}
                    padding={2}
                />
                <IconButton icon={<Icon as={Ionicons} name={"bookmark-outline"} />} />
                <IconButton icon={<Icon as={Ionicons} name={"arrow-undo-outline"} />} onPress={onCommentPress} />
                <IconButton icon={<Icon as={Ionicons} name={"share-outline"} />} />
            </HStack>
            <Divider />
        </VStack>
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
        <VStack style={[styles.commentContainer, {backgroundColor: theme.colors.screen["800"]}]}>
            <FlashList
                ListFooterComponent={footer}
                ListHeaderComponent={header}
                extraData={refresh}
                data={comments}
                renderItem={commentItem}
                keyExtractor={(item) => item.top.comment.id.toString()}
                estimatedItemSize={300}
                refreshControl={refreshControl}
                refreshing={refreshing}
            />
        </VStack>
    );
};

const styles = StyleSheet.create({
    commentContainer: {
        flex: 1,
    },
});

export default PostScreen;