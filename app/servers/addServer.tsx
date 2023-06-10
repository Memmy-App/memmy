import React, {useState} from "react";
import {Button, Settings, StyleSheet, TextInput} from "react-native";
import {ScrollView, useToast} from "native-base";
import {Cell, Section, TableView} from "react-native-tableview-simple";
import ILemmyServer from "../../lemmy/types/ILemmyServer";
import {Stack, useRouter} from "expo-router";

const AddServerScreen = () => {
    const [form, setForm] = useState<ILemmyServer>({
        server: "",
        username: "",
        password: ""
    });

    const router = useRouter();
    const toast = useToast();

    const onFormChange = (name: string, value: string) => {
        setForm({
            ...form,
            [name]: value
        });
    };

    const onSavePress = () => {
        if(!form.server || !form.username || !form.password) {
            toast.show({
                description: "All fields are required.",
                duration: 3000
            });
            return;
        }

        const servers = Settings.get("servers") as ILemmyServer[] ?? [];

        if(servers.find((x) => (x.server.toLowerCase() === form.server.toLowerCase() && x.username.toLowerCase() === form.username.toLowerCase()))) {
            toast.show({
                description: "You have already added this server.",
                duration: 3000
            });
            return;
        }

        servers.push(form);
        Settings.set({
            servers
        });
    };

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen
                options={{
                    headerRight: () => {
                        return(
                            <Button title={"Save"} onPress={onSavePress} />
                        );
                    }
                }}
            />

            <TableView style={styles.table}>
                <Section
                    header={"SERVER ADDRESS"}
                    roundedCorners={true}
                    hideSurroundingSeparators={true}
                    footer={"URL for the server you wish to connect"}
                >
                    <Cell cellContentView={
                        <TextInput
                            style={{fontSize: 16, flex: 1}}
                            placeholder="Server Address"
                            value={form.server}
                            onChangeText={(text) => onFormChange("server", text)}
                        />
                    } />
                </Section>

                <Section
                    header={"SERVER CREDENTIALS"}
                    roundedCorners={true}
                    hideSurroundingSeparators={true}
                    footer={"Credentials for the server you are connecting."}
                >
                    <Cell cellContentView={
                        <TextInput
                            style={{fontSize: 16, flex: 1}}
                            placeholder={"Username"}
                            value={form.username}
                            onChangeText={(text) => onFormChange("username", text)}
                        />
                    } />
                    <Cell cellContentView={
                        <TextInput
                            style={{fontSize: 16, flex: 1}}
                            placeholder={"Password"}
                            value={form.password}
                            onChangeText={(text) => onFormChange("password", text)}
                        />
                    } />
                </Section>
            </TableView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    table: {
        marginHorizontal: 15
    }
});

export default AddServerScreen;