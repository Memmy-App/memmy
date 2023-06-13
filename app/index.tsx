import React, {useEffect} from "react";
import {Settings} from "react-native";
import {SplashScreen, useRootNavigationState, useRouter} from "expo-router";
import ILemmyServer from "../lemmy/types/ILemmyServer";

const IndexScreen = () => {
    const servers = Settings.get("servers") as ILemmyServer[];

    const router = useRouter();
    const navState = useRootNavigationState();

    useEffect(() => {
        if(!navState?.key) {
            return;
        }

        if(!servers || servers.length < 1) {
            router.replace("/onboarding");
            return;
        } else {
            router.replace("/tabs/feeds");
            return;
        }
    }, [navState?.key]);

    return <SplashScreen />;
};

export default IndexScreen;