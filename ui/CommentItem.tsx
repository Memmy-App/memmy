import React from "react";
import {ArrowUpIcon, Divider, HStack, Icon, Text, View, VStack} from "native-base";
import ILemmyComment from "../lemmy/types/ILemmyComment";
import {StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import moment from "moment";
import {truncateName} from "../lemmy/LemmyHelpers";

interface CommentItemProps {
    comment: ILemmyComment,
    depth?: number
}

const CommentItem = ({comment, depth = 1}: CommentItemProps) => {

    return (
        <>
            <VStack mt={2} space={2} pl={(depth - 1) * 2}>
                <View style={depth > 1 && styles.side}>
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
                    <Text>
                        {comment.top.comment.content}
                    </Text>
                </View>
                <Divider />
            </VStack>
            {
                comment.replies.map((reply, index) => (
                    <CommentItem comment={reply} depth={depth + 1} key={index}/>
                ))
            }
        </>
    );
};

const styles = StyleSheet.create({
    side: {
        borderLeftWidth: 2,
        paddingLeft: 8,
        marginLeft: -4,
        borderColor: "green"

    }
});

export default CommentItem;