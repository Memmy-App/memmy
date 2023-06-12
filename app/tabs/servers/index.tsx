import React, {useCallback, useState} from "react";
import {Text, View} from "native-base";
import {Alert, Button, Settings, StyleSheet} from "react-native";
import ILemmyServer from "../../../lemmy/types/ILemmyServer";
import {Stack, useFocusEffect, useRouter} from "expo-router";
import {Cell, Section, TableView} from "react-native-tableview-simple";

const ServersIndex = () => {
    const [servers, setServers] = useState<ILemmyServer[]|null>(null);

    const router = useRouter();

    useFocusEffect(useCallback(() => {
        setServers(Settings.get("servers"));
    }, []));

    const onAddServerPress = () => {
        if(servers && servers.length > 0) {
            Alert.alert("Currently only one server is supported. Please edit your current server for now.");
            return;
        }

        router.push("/tabs/servers/addServer");
    };

    return (
        <View style={styles.container}>

            <Stack.Screen
                options={{
                    headerRight: () => {
                        return (
                            <Button
                                title={"Add"}
                                onPress={onAddServerPress}
                            />
                        );
                    }
                }}
            />

            {
                (!servers || servers.length === 0) ? (
                    <View style={styles.textContainer}>
                        <Text>You have not added any servers.</Text>
                    </View>
                ) : (
                    <TableView style={styles.table}>
                        <Section
                            header={"SERVERS"}
                            roundedCorners={true}
                            hideSurroundingSeparators={true}
                        >
                            {
                                servers.map((server, index) => {
                                    return (
                                        <Cell
                                            key={index}
                                            title={server.server}
                                            accessory={"DisclosureIndicator"}
                                            onPress={() => {
                                                router.push({pathname: "/tabs/servers/addServer", params: {serverIndex: index}});
                                            }}
                                        />
                                    );
                                })
                            }
                        </Section>
                    </TableView>
                )
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    textContainer: {
        justifyContent: "center",
        alignItems: "center"
    },

    table: {
        marginHorizontal: 15
    }
});


export default ServersIndex;