import React, {useEffect} from "react";
import {SplashScreen, useRootNavigationState, useRouter} from "expo-router";
import {getServers} from "../helpers/SettingsHelper";

const IndexScreen = () => {
    const router = useRouter();
    const navState = useRootNavigationState();

    useEffect(() => {
        if(!navState?.key) {
            return;
        }

        load().then();
    }, [navState?.key]);

    const load = async () => {
        const servers = await getServers();

        if(!servers || servers.length < 1) {
            router.replace("/onboarding");
            return;
        } else {
            router.replace("/tabs/feeds");
            return;
        }
    };

    return <SplashScreen />;
};

export default IndexScreen;