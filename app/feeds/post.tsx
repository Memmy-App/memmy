import React, {useEffect, useState} from "react";
import {Post, PostView} from "lemmy-js-client";
import {Stack, useRouter, useSearchParams} from "expo-router";
import {isInitialized, lemmyInstance} from "../../lemmy/LemmyInstance";
import LoadingView from "../../ui/LoadingView";
import {
    ArrowDownIcon,
    ArrowUpIcon,
    Divider,
    HStack,
    Icon,
    IconButton,
    ScrollView,
    Text,
    View,
    VStack
} from "native-base";
import {StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import moment from "moment/moment";

const PostScreen = () => {
    const [post, setPost] = useState<PostView | null>(null);

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
        const res = await lemmyInstance.getPost({
            id: Number(postId)
        });

        setPost(res.post_view);
    };

    if(!post) {
        return <LoadingView />;
    }

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen
                options={{
                    title: `${post.counts.comments} Comments`
                }}
            />
            <Text fontSize={"2xl"}>{post.post.name}</Text>
            <VStack style={styles.body}>
                <Text fontSize={"sm"}>
                    {post.post.body}
                </Text>
            </VStack>
            <HStack mt={2} space={3} alignItems={"center"}>
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
                    <Text>{moment(post.post.published).fromNow()}</Text>
                </HStack>
            </HStack>
            <Divider my={3} />
            <HStack justifyContent={"center"} space={10}>
                <IconButton icon={<Icon as={Ionicons} name={"arrow-up-outline"} />} />
                <IconButton icon={<Icon as={Ionicons} name={"arrow-down-outline"} />} />
                <IconButton icon={<Icon as={Ionicons} name={"bookmark-outline"} />} />
                <IconButton icon={<Icon as={Ionicons} name={"arrow-undo-outline"} />} />
                <IconButton icon={<Icon as={Ionicons} name={"share-outline"} />} />
            </HStack>
            <Divider />
            <HStack style={styles.comments}>

            </HStack>
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