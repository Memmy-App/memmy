import React from "react";
import {StyleSheet} from "react-native";
import {ArrowDownIcon, ArrowUpIcon, Divider, Icon, IconButton, Pressable, Text, View} from "native-base";
import {PostView} from "lemmy-js-client";
import {Ionicons} from "@expo/vector-icons";
import moment from "moment";
import {lemmyAuthToken, lemmyInstance} from "../../lemmy/LemmyInstance";
import {trigger} from "react-native-haptic-feedback";
import {useRouter} from "expo-router";
import {useDispatch} from "react-redux";
import {setPost} from "../../slices/post/postSlice";
import ContentView from "../ContentView";
import {setUpdateVote} from "../../slices/feed/feedSlice";
import FastImage from "react-native-fast-image";

interface FeedItemProps {
    post: PostView,
}

const FeedItem = ({post}: FeedItemProps) => {
    const router = useRouter();
    const dispatch = useDispatch();

    const onVotePress = async (value: -1 | 0 | 1) => {
        if(value === post.my_vote && value !== 0) value = 0;

        const oldValue = post.my_vote;

        dispatch(setUpdateVote({
            postId: post.post.id,
            vote: value,
        }));

        trigger("impactMedium");

        try {
            await lemmyInstance.likePost({
                auth: lemmyAuthToken,
                post_id: post.post.id,
                score: value
            });
        } catch(e) {
            dispatch(setUpdateVote({
                postId: post.post.id,
                vote: oldValue as -1 | 0 | 1,
            }));
            return;
        }
    };

    const onPress = () => {
        dispatch(setPost(post));
        router.push("/tabs/feeds/post");
    };

    return (
        <View style={styles.container}>
            <Pressable onPress={onPress}>
                <>
                    <View style={styles.community}>
                        {
                            post.community.icon && (
                                <FastImage
                                    source={{uri: post.community.icon}}
                                />
                            )
                        }
                    </View>
                    <Text fontSize={"xl"}>
                        {post.post.name}
                    </Text>

                    <ContentView post={post} truncate />

                    <Divider my={2} />

                    <View style={styles.interactions}>
                        <View style={styles.interactions}>
                            {
                                (post.counts.upvotes - post.counts.downvotes) >= 0 ? (
                                    <ArrowUpIcon />
                                ) : (
                                    <ArrowDownIcon />
                                )
                            }
                            <Text>{post.counts.upvotes - post.counts.downvotes}</Text>
                            <Icon as={Ionicons} name={"chatbubble-outline"} />
                            <Text>{post.counts.comments}</Text>
                            <Icon as={Ionicons} name={"time-outline"} />
                            <Text>{moment(post.post.published).utc(true).fromNow()}</Text>
                        </View>

                        <View>
                            <View style={{alignItems: "flex-end", flex: 1, alignSelf: "flex-end", flexDirection: "row"}}>
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
                                    backgroundColor={post.my_vote !== 1 ? "white" : "green.500"}
                                    padding={1}
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
                                    backgroundColor={post.my_vote !== -1 ? "white" : "orange.500"}
                                    padding={1}
                                />
                            </View>
                        </View>
                    </View>
                </>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 8,
        backgroundColor: "white"
    },

    community: {
        flexDirection: "row"
    },

    communityIcon: {
        flex: 1,
        width: 24,
        aspectRatio: 1
    },

    image: {
        flex: 1,
        width: "100%",
        aspectRatio: 1
    },

    interactions: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
});

export default FeedItem;