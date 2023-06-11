import React from "react";
import {Icon, View} from "native-base";
import {StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";


const CommentItemLeftActions = () => {
    return (
        <View style={styles.leftActions}>
            <Icon
                as={Ionicons}
                name={"arrow-undo"}
                color={"white"}
                size={10}
                pr={12}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    leftActions: {
        flex: 1,
        alignItems: "flex-end",
        justifyContent: "center",
        backgroundColor: "#007AFF",
    },
});

export default CommentItemLeftActions;