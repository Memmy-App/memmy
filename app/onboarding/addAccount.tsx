import React, {useState} from "react";
import {Button, Text, useToast, VStack} from "native-base";
import {Alert, Settings} from "react-native";
import CTextInput from "../../ui/CTextInput";
import ILemmyServer from "../../lemmy/types/ILemmyServer";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {useRouter} from "expo-router";
import {initialize, lemmyAuthToken} from "../../lemmy/LemmyInstance";
import LoadingModal from "../../ui/LoadingModal";
import {addServer} from "../../helpers/SettingsHelper";

const AddAccountScreen = () => {
    const [form, setForm] = useState<ILemmyServer>({
        server: "",
        username: "",
        password: "",
        auth: ""
    });
    const [loading, setLoading] = useState(false);

    const toast = useToast();
    const router = useRouter();

    const onFormChange = (name, value) => {
        setForm({
            ...form,
            [name]: value
        });
    };

    const onPress = async () => {
        if(!form.server || !form.username || !form.password) {
            toast.show({
                description: "All fields are required.",
                duration: 3000
            });
            return;
        }

        setLoading(true);

        const regex = new RegExp("^(?:https?:\\/\\/)?([^\\/]+)");
        const serverParsed = form.server.match(regex)[1];

        const server: ILemmyServer = {
            username: form.username,
            password: form.password,
            server: serverParsed,
        };

        try {
            setLoading(true);

            await initialize(server);
        } catch(e) {
            Alert.alert("Error", e);
            setLoading(false);
            return;
        }

        server.auth = lemmyAuthToken;

        await addServer(server);

        setLoading(false);
        router.replace("/tabs/feeds");
    };

    return (
        <KeyboardAwareScrollView>
            <LoadingModal loading={loading} />

            <VStack pt={10} mb={5} space={"md"} justifyContent={"center"}>
                <Text fontSize={32} textAlign={"center"}>
                    Existing Account
                </Text>
                <CTextInput
                    name={"server"}
                    value={form.server}
                    placeholder={"Server"}
                    label={"Server"}
                    onChange={onFormChange}
                    autoCapitalize={"none"}
                    autoCorrect={false}
                />
                <CTextInput
                    name={"username"}
                    value={form.username}
                    placeholder={"Username"}
                    label={"Username"}
                    onChange={onFormChange}
                    autoCapitalize={"none"}
                    autoCorrect={false}
                />
                <CTextInput
                    name={"password"}
                    value={form.password}
                    placeholder={"Password"}
                    label={"Password"}
                    onChange={onFormChange}
                    autoCapitalize={"none"}
                    autoCorrect={false}
                    secure
                />
                <Button mx={2} disabled={loading} onPress={onPress}>
                    Add Account
                </Button>
            </VStack>
        </KeyboardAwareScrollView>
    );
};

export default AddAccountScreen;