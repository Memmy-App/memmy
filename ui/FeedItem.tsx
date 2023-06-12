import React, {useState} from "react";
import {StyleSheet, TouchableOpacity} from "react-native";
import {ArrowDownIcon, ArrowUpIcon, Divider, Icon, IconButton, Pressable, Text, View} from "native-base";
import {PostView} from "lemmy-js-client";
import {Ionicons} from "@expo/vector-icons";
import moment from "moment";
import {lemmyAuthToken, lemmyInstance} from "../lemmy/LemmyInstance";
import {trigger} from "react-native-haptic-feedback";
import {Image} from "expo-image";
import {ExtensionType, getLinkInfo} from "../helpers/LinkHelper";
import {truncatePost} from "../helpers/TextHelper";
import LinkButton from "./LinkButton";
import {useRouter} from "expo-router";
import ImageView from "react-native-image-viewing";
import {useDispatch} from "react-redux";
import {setPost} from "../slices/post/postSlice";

interface FeedItemProps {
    post: PostView,
}

const FeedItem = ({post}: FeedItemProps) => {
    const [myVote, setMyVote] = useState(post.my_vote);
    const [imageVisible, setImageVisible] = useState(false);
    const linkInfo = getLinkInfo(post.post.url);

    const router = useRouter();
    const dispatch = useDispatch();

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

    const onPress = () => {
        dispatch(setPost(post));
        router.push("/feeds/post");
    };

    const onImagePress = () => {
        setImageVisible(prev => !prev);
    };

    return (
        <View style={styles.container}>
            <Pressable onPress={onPress}>
                <>
                    <View style={styles.community}>
                        {
                            post.community.icon && (
                                <Image
                                    source={{uri: post.community.icon}}
                                    cachePolicy={"disk"}
                                />
                            )
                        }
                        <Text fontSize={"sm"}>{post.community.name}</Text>
                    </View>
                    <Text fontSize={"xl"}>
                        {post.post.name}
                    </Text>

                    {
                        linkInfo.extType === ExtensionType.NONE && (
                            <Text fontSize={"md"}>{truncatePost(post.post.body) ?? ""}</Text>
                        ) || linkInfo.extType === ExtensionType.IMAGE && (
                            <>
                                <Pressable onPress={onImagePress}>
                                    <Image
                                        source={{uri: post.post.url}}
                                        style={styles.image}
                                        cachePolicy={"disk"}
                                    />
                                </Pressable>
                                <ImageView
                                    images={[{uri: post.post.url.toString()}]}
                                    imageIndex={0}
                                    visible={imageVisible}
                                    onRequestClose={onImagePress}
                                />
                            </>
                        ) || linkInfo.extType === ExtensionType.VIDEO && (
                            <LinkButton link={linkInfo.link} />
                        ) || linkInfo.extType === ExtensionType.GENERIC && (
                            <LinkButton link={linkInfo.link} />
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