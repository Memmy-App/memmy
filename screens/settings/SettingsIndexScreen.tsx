import React, {useCallback, useState} from "react";
import {useTheme, VStack} from "native-base";
import {StyleSheet, Switch} from "react-native";
import {Cell, Section, TableView} from "react-native-tableview-simple";
import {getBuildNumber, getVersion} from "react-native-device-info";
import {getServers} from "../../helpers/SettingsHelper";
import LoadingView from "../../ui/LoadingView";
import {useAppDispatch, useAppSelector} from "../../store";
import {selectSettings} from "../../slices/settings/settingsSlice";
import {setSetting} from "../../slices/settings/settingsActions";
import {useActionSheet} from "@expo/react-native-action-sheet";
import {useFocusEffect} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

const SettingsIndexScreen = ({navigation}: {navigation: NativeStackNavigationProp<any>}) => {
    const [server, setServer] = useState(null);

    const settings = useAppSelector(selectSettings);

    const dispatch = useAppDispatch();
    const theme = useTheme();
    const {showActionSheetWithOptions} = useActionSheet();

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
                        onPress={() => navigation.push("EditAccount", {server})}
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
                    <Cell
                        cellStyle={"RightDetail"}
                        title={"Default Sort"}
                        detail={settings.defaultSort}
                        accessory={"DisclosureIndicator"}
                        onPress={() => {
                            const options = ["Top Day", "Top Week", "Hot", "New", "Most Comments", "Cancel"];
                            const cancelButtonIndex = 5;

                            showActionSheetWithOptions({
                                options,
                                cancelButtonIndex
                            }, (index: number) => {
                                if(index === cancelButtonIndex) return;

                                let selection;

                                if(index === 0) {
                                    selection = "TopDay";
                                } else if(index === 1) {
                                    selection = "TopWeek";
                                } else if(index === 4) {
                                    selection = "MostComments";
                                } else {
                                    selection = options[index];
                                }

                                dispatch(setSetting({
                                    key: "defaultSort",
                                    value: selection
                                }));
                            });
                        }}
                        backgroundColor={theme.colors.screen["700"]}
                        titleTextColor={theme.colors.lightText}
                        rightDetailColor={theme.colors.screen["400"]}
                    />
                    <Cell
                        cellStyle={"RightDetail"}
                        title={"Default Listing Type"}
                        detail={settings.defaultListingType}
                        accessory={"DisclosureIndicator"}
                        onPress={() => {
                            const options = ["All", "Local", "Subscribed", "Cancel"];
                            const cancelButtonIndex = 3;

                            showActionSheetWithOptions({
                                options,
                                cancelButtonIndex
                            }, (index: number) => {
                                if(index === cancelButtonIndex) return;

                                dispatch(setSetting({
                                    key: "defaultListingType",
                                    value: options[index]
                                }));
                            });
                        }}
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