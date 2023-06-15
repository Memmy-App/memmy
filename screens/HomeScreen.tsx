import React, {useEffect} from "react";
import {getServers} from "../helpers/SettingsHelper";
import {useAppDispatch} from "../store";
import {loadSettings} from "../slices/settings/settingsActions";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

const IndexScreen = ({navigation}: {navigation: NativeStackNavigationProp<any>}) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(loadSettings());
        load().then();
    }, []);

    const load = async () => {
        const servers = await getServers();

        if(!servers || servers.length < 1) {
            navigation.replace("Onboarding");
            return;
        } else {
            navigation.replace("Tabs");
            return;
        }
    };
};

export default IndexScreen;