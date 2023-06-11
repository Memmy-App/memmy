import React, {useState} from "react";
import {KeyboardAvoidingView, TextArea, View} from "native-base";
import {Alert, Button, StyleSheet, TextInput} from "react-native";
import {Stack, useRouter, useSearchParams} from "expo-router";
import {lemmyAuthToken, lemmyInstance} from "../../lemmy/LemmyInstance";

const CommentModalScreen = () => {
    const [content, setContent] = useState("");

    const router = useRouter();

    const {commentId, postId} = useSearchParams();

    const onSubmitPress = async () => {
        if(!content) {
            return;
        }

        try {
            const res = await lemmyInstance.createComment({
                auth: lemmyAuthToken,
                content: content,
                post_id: postId ? Number(postId) : undefined,
                parent_id: commentId ? Number(commentId) : undefined
            });
        } catch(e) {
            Alert.alert("Error submitting comment.");
            return;
        }
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