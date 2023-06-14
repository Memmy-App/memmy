import React, {useCallback, useState} from "react";
import {useTheme, VStack} from "native-base";
import {StyleSheet, Switch} from "react-native";
import {Cell, Section, TableView} from "react-native-tableview-simple";
import {useFocusEffect, useRouter} from "expo-router";
import {getBuildNumber, getVersion} from "react-native-device-info";
import {getServers} from "../../../helpers/SettingsHelper";
import LoadingView from "../../../ui/LoadingView";
import {useAppDispatch, useAppSelector} from "../../../store";
import {selectSettings} from "../../../slices/settings/settingsSlice";
import {setSetting} from "../../../slices/settings/settingsActions";

const SettingsIndexScreen = () => {
    const [server, setServer] = useState(null);

    const settings = useAppSelector(selectSettings);

    const router = useRouter();
    const dispatch = useAppDispatch();
    const theme = useTheme();

    useFocusEffect(useCallback(() => {
        load().then();
    }, []));

    const load = async () => {
        const servers = await getServers();
        setServer(servers[0]);
    };

    const onChange = (key: string, value: string) => {
        dispatch(setSetting({
            key,
            value
        }));
    };

    if(!server) {
        return <LoadingView />;
    }

    return (
        <VStack backgroundColor={"screen.800"} flex={1}>
            <TableView style={styles.table}>
                <Section
                    header={"ACCOUNT"}
                    roundedCorners={true}
                    hideSurroundingSeparators={true}
                >
                    <Cell
                        cellStyle={"RightDetail"}
                        title={"Server"}
                        detail={server.server}
                        backgroundColor={theme.colors.screen["700"]}
                        titleTextColor={theme.colors.lightText}
                        rightDetailColor={theme.colors.screen["400"]}
                    />
                    <Cell
                        cellStyle={"RightDetail"}
                        title={"Username"}
                        detail={server.username}
                        backgroundColor={theme.colors.screen["700"]}
                        titleTextColor={theme.colors.lightText}
                        rightDetailColor={theme.colors.screen["400"]}
                    />

                    <Cell
                        cellStyle={"Basic"}
                        title={"Change Account Settings"}
                        accessory={"DisclosureIndicator"}
                        onPress={() => router.push("/tabs/settings/editAccount")}
                        backgroundColor={theme.colors.screen["700"]}
                        titleTextColor={theme.colors.lightText}
                        rightDetailColor={theme.colors.screen["400"]}
                    />
                </Section>

                <Section
                    header={"APPEARANCE"}
                    roundedCorners={true}
                    hideSurroundingSeparators={true}
                >
                    <Cell
                        title={"Swipe Gestures"}
                        cellAccessoryView={<Switch
                            value={settings.swipeGestures === "true"}
                            onValueChange={(v) => onChange("swipeGestures", v.toString())}
                        />}
                        backgroundColor={theme.colors.screen["700"]}
                        titleTextColor={theme.colors.lightText}
                        rightDetailColor={theme.colors.screen["400"]}
                    />
                </Section>

                <Section
                    header={"ABOUT"}
                    roundedCorners={true}
                    hideSurroundingSeparators={true}
                >
                    <Cell
                        cellStyle={"RightDetail"}
                        title={"Version"}
                        detail={`${getVersion()} (${getBuildNumber()})`}
                        backgroundColor={theme.colors.screen["700"]}
                        titleTextColor={theme.colors.lightText}
                        rightDetailColor={theme.colors.screen["400"]}
                    />
                </Section>

                <Section
                    header={"DEBUG"}
                    roundedCorners={true}
                    hideSurroundingSeparators={true}
                >

                </Section>
            </TableView>
        </VStack>
    );
};

const styles = StyleSheet.create({
    table: {
        marginHorizontal: 15
    }
});

export default SettingsIndexScreen;