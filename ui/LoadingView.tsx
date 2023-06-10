import React from "react";
import {Spinner, View} from "native-base";
import {StyleSheet} from "react-native";

const LoadingView = () => {
    return (
        <View style={styles.container}>
            <Spinner />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});

export default LoadingView;