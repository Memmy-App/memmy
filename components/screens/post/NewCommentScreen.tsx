import React from "react";
import {Button, StyleSheet, TextInput} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {useAppSelector} from "../../../store";
import {selectNewComment} from "../../../slices/newComment/newCommentSlice";
import LoadingView from "../../ui/LoadingView";
import {useColorMode, useTheme} from "native-base";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useNewComment} from "../../hooks/newComment/newCommentHooks";

const NewCommentScreen = ({navigation}: {navigation: NativeStackNavigationProp<any>}) => {
    const newComment = useNewComment();
    const theme = useTheme();
    const colorMode = useColorMode();

    const {responseTo} = useAppSelector(selectNewComment);

    navigation.setOptions({
        headerLeft: () => (
            <Button title={"Cancel"} onPress={() => navigation.pop()} />
        ),
        headerRight: () => (
            <Button title={"Submit"} onPress={newComment.doSubmit} disabled={newComment.loading} />
        ),
        title: responseTo.post ? "Replying to Post" : "Replying to Comment"
    });

    if(newComment.loading) {
        return <LoadingView />;
    }

    return (
        <KeyboardAwareScrollView style={{backgroundColor: theme.colors.screen[800]}}>
            <TextInput
                multiline={true}
                autoCapitalize={"sentences"}
                style={[styles.input, {backgroundColor: theme.colors.screen["700"]}]}
                numberOfLines={20}
                value={newComment.content}
                onChangeText={newComment.setContent}
                keyboardAppearance={colorMode.colorMode}
            />
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    input: {
        alignSelf: "stretch",
        padding: 10,
        paddingTop: 15,
        height: 300,
        fontSize: 16,
        color: "#fff"
    }
});

export default NewCommentScreen;