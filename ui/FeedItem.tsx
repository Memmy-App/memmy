import React, {useEffect, useState} from "react";
import {Image, StyleSheet, TouchableOpacity} from "react-native";
import {ArrowDownIcon, ArrowUpIcon, Divider, Icon, IconButton, Text, View} from "native-base";
import {PostView} from "lemmy-js-client";
import {Ionicons} from "@expo/vector-icons";
import moment from "moment";
import {lemmyAuthToken, lemmyInstance} from "../lemmy/LemmyInstance";
import {trigger} from "react-native-haptic-feedback";

interface FeedItemProps {
    post: PostView,
    onPress: (postId: number) => void|Promise<void>
}

const FeedItem = ({post, onPress}: FeedItemProps) => {
    const [myVote, setMyVote] = useState(post.my_vote);

    const onVotePress = async (value: -1 | 0 | 1) => {
        if(value === 1 && myVote === 1) {
            value = 0;
        } else if(value === -1 && myVote === -1) {
            value = 0;
        }

        const oldValue = myVote;

        setMyVote(value);
        trigger("impactMedium");

        try {
            await lemmyInstance.likePost({
                auth: lemmyAuthToken,
                post_id: post.post.id,
                score: value
            });
        } catch(e) {
            setMyVote(oldValue);
            return;
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => onPress(post.post.id)}>
                <View style={styles.community}>
                    {
                        post.community.icon && (
                            <Image source={{uri: post.community.icon}} />
                        )
                    }
                    <Text fontSize={"sm"}>{post.community.name}</Text>
                </View>
                <Text fontSize={"xl"}>
                    {post.post.name}
                </Text>

                {
                    post.post.thumbnail_url && (
                        <View>
                            <Image
                                source={{uri: post.post.thumbnail_url}}
                                alt={post.post.name}
                                style={styles.image}
                            />
                        </View>
                    )
                }

                {
                    !post.post.thumbnail_url && !post.post.embed_description && post.post.body && (
                        <View>
                            <Text fontSize={"md"}>{
                                post.post.body.length > 200 ? post.post.body.slice(0, 200) + "..." : post.post.body
                            }</Text>
                        </View>
                    )
                }

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
                        <Text>{moment(post.post.published).fromNow()}</Text>
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
                                        color={myVote === 1 ? "white" : "blue.500"}
                                    />
                                }
                                backgroundColor={myVote !== 1 ? "white" : "green.500"}
                                padding={1}
                            />
                            <IconButton
                                icon={
                                    <Icon
                                        as={Ionicons}
                                        name={"arrow-down-outline"}
                                        size={6}
                                        onPress={() => onVotePress(-1)}
                                        color={myVote === -1 ? "white" : "blue.500"}
                                    />
                                }
                                backgroundColor={myVote !== -1 ? "white" : "orange.500"}
                                padding={1}
                            />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
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