import React from "react";
import {Text, View} from "native-base";
import {Button, StyleSheet} from "react-native";

interface LoadingViewProps {
    onRetryPress: () => void|Promise<void>
}

const LoadingErrorView = ({onRetryPress}: LoadingViewProps) => {
    return (
        <View style={styles.container}>
            <Text fontStyle={"italic"} color={"gray.500"}>
                Error loading content :(
            </Text>
            <Button title={"Retry"} onPress={onRetryPress} />
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

export default LoadingErrorView;