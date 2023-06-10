import React, {useEffect, useState} from "react";
import {Button, Image, StyleSheet, TouchableOpacity} from "react-native";
import {ArrowDownIcon, ArrowUpIcon, Divider, Icon, IconButton, Text, View} from "native-base";
import {PostView} from "lemmy-js-client";
import {Ionicons} from "@expo/vector-icons";
import moment from "moment";

interface FeedItemProps {
    post: PostView,
    onPress: () => void|Promise<void>
}

const FeedItem = ({post, onPress}: FeedItemProps) => {
    useEffect(() => {
        console.log(post.community.icon);
    }, []);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onPress}>
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
                    <View style={{alignItems: "flex-end", flex: 1, alignSelf: "flex-end", flexDirection: "row"}}>
                        <IconButton icon={<Icon as={Ionicons} name={"arrow-up-outline"} size={6} />} />
                        <IconButton icon={<Icon as={Ionicons} name={"arrow-down-outline"} size={6} />} />
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