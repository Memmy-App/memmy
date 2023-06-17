import React from "react";
import {useTheme, VStack} from "native-base";
import {StyleSheet, Switch} from "react-native";
import {Cell, Section, TableView} from "react-native-tableview-simple";
import {getBuildNumber, getVersion} from "react-native-device-info";
import {useAppDispatch, useAppSelector} from "../../../store";
import {selectSettings} from "../../../slices/settings/settingsSlice";
import {setSetting} from "../../../slices/settings/settingsActions";
import {useActionSheet} from "@expo/react-native-action-sheet";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {selectAccounts} from "../../../slices/accounts/accountsSlice";
import CCell from "../../ui/table/CCell";

const SettingsIndexScreen = ({navigation}: {navigation: NativeStackNavigationProp<any>}) => {
    const settings = useAppSelector(selectSettings);
    const accounts = useAppSelector(selectAccounts);

    const dispatch = useAppDispatch();
    const theme = useTheme();
    const {showActionSheetWithOptions} = useActionSheet();

    const onChange = (key: string, value: any) => {
        dispatch(setSetting({[key]: value}));
    };

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
                        detail={accounts[0].instance}
                        backgroundColor={theme.colors.screen["700"]}
                        titleTextColor={theme.colors.lightText}
                        rightDetailColor={theme.colors.screen["400"]}
                    />
                    <Cell
                        cellStyle={"RightDetail"}
                        title={"Username"}
                        detail={accounts[0].username}
                        backgroundColor={theme.colors.screen["700"]}
                        titleTextColor={theme.colors.lightText}
                        rightDetailColor={theme.colors.screen["400"]}
                    />

                    <Cell
                        cellStyle={"Basic"}
                        title={"Change Account Settings"}
                        accessory={"DisclosureIndicator"}
                        onPress={() => navigation.push("EditAccount")}
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
                            value={settings.swipeGestures}
                            onValueChange={(v) => onChange("swipeGestures", v)}
                        />}
                        backgroundColor={theme.colors.screen["700"]}
                        titleTextColor={theme.colors.lightText}
                        rightDetailColor={theme.colors.screen["400"]}
                    />
                    <CCell props={{
                        cellStyle: "RightDetail",
                        title: "Show Instance For Usernames",
                        cellAccessoryView: (
                            <Switch
                                value={settings.showInstanceForUsernames}
                                onValueChange={(v) => onChange("showInstanceForUsernames", v)}
                            />
                        )
                    }} />
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

                                dispatch(setSetting({defaultSort: selection}));
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

                                dispatch(setSetting({defaultListingType: options[index]}));
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