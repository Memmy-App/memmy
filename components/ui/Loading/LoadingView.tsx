import React from "react";
import {Spinner, VStack} from "native-base";

const LoadingView = () => {
    return (
        <VStack flex={1} justifyContent={"center"} backgroundColor={"screen.800"}>
            <Spinner size={"large"} />
        </VStack>
    );
};

export default LoadingView;