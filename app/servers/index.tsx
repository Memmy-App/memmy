import React, {useEffect, useState} from "react";
import {Text, View} from "native-base";
import {Button, Settings, StyleSheet} from "react-native";
import ILemmyServer from "../../lemmy/types/ILemmyServer";
import {Stack, useRouter} from "expo-router";
import {Cell, Section, TableView} from "react-native-tableview-simple";

const TabsIndex = () => {
    const [servers, setServers] = useState<ILemmyServer[]|null>(null);

    const router = useRouter();

    useEffect(() => {
        setServers(Settings.get("servers"));
    }, []);

    const onAddServerPress = () => {
        router.push("/servers/addServer");
    };

    return (
        <View style={styles.container}>

            <Stack.Screen
                options={{
                    headerRight: () => {
                        return (
                            <Button
                                title={"+"}
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
                                                router.push(`/servers/${server.server}`);
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


export default TabsIndex;