import React, {useEffect, useState} from "react";
import {Alert, Button, StyleSheet, TextInput} from "react-native";
import {Stack, usePathname, useRouter, useSearchParams} from "expo-router";
import {lemmyAuthToken, lemmyInstance} from "../../lemmy/LemmyInstance";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {useAppSelector} from "../../store";
import {selectNewComment} from "../../slices/newComment/newCommentSlice";
import {useDispatch} from "react-redux";
import {setPostNewComment} from "../../slices/post/postSlice";

const CommentModalScreen = () => {
    const [content, setContent] = useState("");

    const router = useRouter();
    const dispatch = useDispatch();

    const {responseTo} = useAppSelector(selectNewComment);

    useEffect(() => {
        if(!responseTo.post) return;
        console.log("post id: ", responseTo.post.post.id);
    }, []);

    const onSubmitPress = async () => {
        if(!content) {
            return;
        }

        try {
            const res = await lemmyInstance.createComment({
                auth: lemmyAuthToken,
                content: content,
                post_id: responseTo.post ? responseTo.post.post.id : undefined,
                parent_id: responseTo.comment ? responseTo.comment.comment.id : undefined
            });

            dispatch(setPostNewComment({
                comment: res.comment_view,
                isTopComment: responseTo.post !== undefined
            }));

            router.back();
        } catch(e) {
            Alert.alert("Error submitting comment.");
            return;
        }
    };

    return (
        <KeyboardAwareScrollView>
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
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "white",
    },

    input: {
        backgroundColor: "white",
        alignSelf: "stretch",
        padding: 10,
        paddingTop: 15
    }
});

export default CommentModalScreen;