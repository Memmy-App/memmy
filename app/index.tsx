import React, {useEffect} from "react";
import {Settings} from "react-native";
import {SplashScreen, useRootNavigationState, useRouter} from "expo-router";
import ILemmyServer from "../lemmy/types/ILemmyServer";

const IndexScreen = () => {
    const servers = Settings.get("servers") as ILemmyServer[];

    const router = useRouter();
    const navState = useRootNavigationState();

    if(!navState?.key) {
        return <SplashScreen />;
    }

    if(!servers || servers.length < 1) {
        router.replace("/onboarding/index");
        return;
    } else {
        router.replace("/tabs/feeds");
        return;
    }
};

export default IndexScreen;