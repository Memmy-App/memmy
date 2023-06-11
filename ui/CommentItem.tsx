import React, {useRef, useState} from "react";
import {
    Divider,
    HStack,
    Icon,
    Pressable,
    Text,
    View,
    VStack
} from "native-base";
import ILemmyComment from "../lemmy/types/ILemmyComment";
import {StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import moment from "moment";
import {truncateName} from "../lemmy/LemmyHelpers";
import RenderHTML from "react-native-render-html";
import {parseMarkdown} from "../helpers/MarkdownHelper";
import {depthToColor} from "../helpers/ColorHelper";

interface CommentItemProps {
    comment: ILemmyComment,
    depth?: number
}

const CommentItem = ({comment, depth = 1}: CommentItemProps) => {
    const lastCommentId = useRef(comment.top.comment.id);

    const [collapsed, setCollapsed] = useState(false);
    const [pressed, setPressed] = useState(false);

    if(comment.top.comment.id !== lastCommentId.current) {
        lastCommentId.current = comment.top.comment.id;
        setCollapsed(false);
    }

    return (
        <View>
            <VStack mt={2} space={2} pl={(depth - 1) * 2}>
                <View style={[depth > 1 && styles.side, {borderLeftColor: depthToColor(depth)}]}>
                    <Pressable
                        onPress={() => setCollapsed(!collapsed)}
                        onPressIn={() => setPressed(true)}
                        onPressOut={() => setPressed(false)}
                        backgroundColor={pressed ? "gray.100" : "white"}
                    >
                        <HStack mb={1} space={3} alignItems={"center"}>
                            <Text fontWeight={"bold"}>{truncateName(comment.top.creator.name)}</Text>
                            <HStack space={0} alignItems={"center"}>
                                <Icon as={Ionicons} name={"arrow-up-outline"} />
                                <Text color={"gray.500"}>{comment.top.counts.score}</Text>
                            </HStack>
                            <HStack space={1} alignItems={"center"}>
                                <Icon as={Ionicons} name={"time-outline"} />
                                <Text color={"gray.500"}>{moment(comment.top.comment.published).utc(true).fromNow()}</Text>
                            </HStack>
                        </HStack>
                        {
                            !collapsed ? (
                                <Text>
                                    {
                                        (comment.top.comment.deleted || comment.top.comment.removed) ? (
                                            <Text fontStyle={"italic"} color={"gray.500"}>Comment was deleted :(</Text>
                                        ) : (
                                            // <RenderHTML
                                            //     source={{
                                            //         html: parseMarkdown(comment.top.comment.content)
                                            //     }}
                                            //     contentWidth={100}
                                            // />
                                            <Text>{comment.top.comment.content}</Text>
                                        )
                                    }
                                </Text>
                            ) : (
                                <Text fontStyle={"italic"} color={"gray.500"}>
                                    Comment collapsed
                                </Text>
                            )
                        }
                    </Pressable>
                </View>
                <Divider />
            </VStack>
            <VStack>
                {
                    comment.replies.map((reply) => (
                        <View style={{display: collapsed ? "none" : "flex"}} key={reply.top.comment.id}>
                            <CommentItem comment={reply} depth={depth + 1} />
                        </View>
                    ))
                }
            </VStack>
        </View>
    );
};

const styles = StyleSheet.create({
    side: {
        borderLeftWidth: 2,
        paddingLeft: 8,
        marginLeft: -4,
    }
});

export default CommentItem;