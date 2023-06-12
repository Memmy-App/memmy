import React, {useEffect, useState} from "react";
import {Alert, Button, StyleSheet, TextInput} from "react-native";
import {Stack, useRouter} from "expo-router";
import {lemmyAuthToken, lemmyInstance} from "../../lemmy/LemmyInstance";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {useAppSelector} from "../../store";
import {clearNewComment, selectNewComment} from "../../slices/newComment/newCommentSlice";
import {useDispatch} from "react-redux";
import {setPostNewComment} from "../../slices/post/postSlice";
import LoadingView from "../../ui/LoadingView";

const CommentModalScreen = () => {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const dispatch = useDispatch();

    const {responseTo} = useAppSelector(selectNewComment);

    useEffect(() => {
        return () => {
            dispatch(clearNewComment());
        };
    }, []);

    const onSubmitPress = async () => {
        if(!content) {
            return;
        }

        try {
            setLoading(true);

            const res = await lemmyInstance.createComment({
                auth: lemmyAuthToken,
                content: content,
                post_id: responseTo.post ? responseTo.post.post.id : responseTo.comment.post.id,
                parent_id: responseTo.comment ? responseTo.comment.comment.id : undefined
            });

            dispatch(setPostNewComment({
                comment: res.comment_view,
                isTopComment: !!responseTo.post
            }));

            router.back();
        } catch(e) {
            console.log(e);
            setLoading(false);
            Alert.alert("Error submitting comment.");
            return;
        }
    };

    if(loading) {
        return <LoadingView />;
    }

    return (
        <KeyboardAwareScrollView>
            <Stack.Screen
                options={{
                    headerLeft: () => (
                        <Button title={"Cancel"} onPress={router.back} />
                    ),
                    headerRight: () => (
                        <Button title={"Submit"} onPress={onSubmitPress} disabled={loading} />
                    ),
                    title: responseTo.post ? "Replying to Post" : "Replying to Comment"
                }}
            />
            <TextInput
                multiline={true}
                autoCapitalize={"sentences"}
                style={styles.input}
                numberOfLines={20}
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
        paddingTop: 15,
        height: 300
    }
});

export default CommentModalScreen;