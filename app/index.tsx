import React, {useEffect} from "react";
import {SplashScreen, useRootNavigationState, useRouter} from "expo-router";
import {getServers} from "../helpers/SettingsHelper";
import {useAppDispatch} from "../store";
import {loadSettings} from "../slices/settings/settingsActions";

const IndexScreen = () => {
    const router = useRouter();
    const navState = useRootNavigationState();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(!navState?.key) {
            return;
        }

        dispatch(loadSettings());
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