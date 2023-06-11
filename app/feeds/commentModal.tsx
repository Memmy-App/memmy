import React, {useState} from "react";
import {KeyboardAvoidingView, TextArea, View} from "native-base";
import {Button, StyleSheet, TextInput} from "react-native";
import {Navigator, Stack, useRouter, useSearchParams} from "expo-router";
import {Screen} from "expo-router/build/primitives";
import {lemmyInstance} from "../../lemmy/LemmyInstance";
import post from "./post";

const CommentModalScreen = () => {
    const [content, setContent] = useState("");

    const router = useRouter();

    const {commentId, postId} = useSearchParams();

    const onSubmitPress = () => {
        if(!content) {
            return;
        }

        const res = lemmyInstance.createComment({
            auth: "",
            content: content,
            post_id: postId ? Number(postId) : undefined,
            parent_id: commentId ? Number(commentId) : undefined
        });
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <Stack.Screen
                options={{
                    headerLeft: () => (
                        <Button title={"Cancel"} onPress={router.back} />
                    ),
                    headerRight: () => (
                        <Button title={"Submit"} onPress={onSubmitPress} />
                    )
                }}
            />
            <TextInput
                multiline={true}
                autoCapitalize={"sentences"}
                style={styles.input}
                numberOfLines={10}
                value={content}
                onChangeText={setContent}
            />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "white",
    },

    input: {
        backgroundColor: "red",
        alignSelf: "stretch",
        padding: 10,
        paddingTop: 15
    }
});

export default CommentModalScreen;