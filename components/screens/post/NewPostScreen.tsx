import React from "react";
import {StyleSheet} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {Input} from "native-base";

const NewPostScreen = () => {
    const router = useRouter();

    return (
        <KeyboardAwareScrollView>
            <Input />
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({

});

export default NewPostScreen;