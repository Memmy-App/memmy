import React, {useEffect, useState} from "react";
import {Button, HStack, Switch, Text, useTheme, useToast, VStack} from "native-base";
import ILemmyServer from "../../lemmy/types/ILemmyServer";
import {initialize, lemmyAuthToken} from "../../lemmy/LemmyInstance";
import {Alert, Linking} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import CTextInput from "../../ui/CTextInput";
import {LemmyHttp} from "lemmy-js-client";
import LoadingModal from "../../ui/LoadingModal";
import {addServer} from "../../helpers/SettingsHelper";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

interface RegisterForm {
    server: string,
    username: string,
    email: string,
    password: string,
    passwordAgain: string,
    showNsfw: boolean
}

const CreateAccountScreen = ({navigation}: {navigation: NativeStackNavigationProp<any>}) => {
    const [form, setForm] = useState<RegisterForm>({
        server: "",
        username: "",
        email: "",
        password: "",
        passwordAgain: "",
        showNsfw: false
    });
    const [loading, setLoading] = useState(false);
    const [sentEmail, setSentEmail] = useState(false);
    const [ready, setReady] = useState(false);

    const toast = useToast();
    const theme = useTheme();

    useEffect(() => {
        if(!ready) return;

        onReady().then();
    }, [ready]);

    const onFormChange = (name, value) => {
        setForm({
            ...form,
            [name]: value
        });
    };

    const onSwitchChange = (value: boolean) => {
        setForm({
            ...form,
            showNsfw: value
        });
    };

    const onPress = async () => {
        if (!form.server || !form.username || !form.email || !form.password || !form.passwordAgain) {
            toast.show({
                description: "All fields are required.",
                duration: 3000
            });
            return;
        }

        if(form.password !== form.passwordAgain) {
            toast.show({
                description: "Passwords do not match.",
                duration: 3000
            });

            return;
        }

        setLoading(true);

        const regex = new RegExp("^(?:https?:\\/\\/)?([^\\/]+)");
        const serverParsed = form.server.match(regex)[1];

        try {
            const tempInstance = new LemmyHttp(`https://${serverParsed}`);
            const res = await tempInstance.register({
                username: form.username,
                password: form.password,
                password_verify: form.passwordAgain,
                email: form.email,
                show_nsfw: form.showNsfw
            });

            setLoading(false);

            if(!res.registration_created && !res.verify_email_sent) {
                Alert.alert("Error", "An error occurred while completing registration.");
            } else if(res.verify_email_sent) {
                setSentEmail(true);
            } else {
                setReady(true);
            }
        } catch(e) {
            console.log(e);
            setLoading(false);
            Alert.alert("Error", e.toString());
        }
    };

    const onReady = async () => {
        setLoading(true);

        const regex = new RegExp("^(?:https?:\\/\\/)?([^\\/]+)");
        const serverParsed = form.server.match(regex)[1];

        const server: ILemmyServer = {
            username: form.username,
            password: form.password,
            server: serverParsed,
        };

        try {
            await initialize(server);
        } catch (e) {
            Alert.alert("Error", e.toString());
            setLoading(false);
            return;
        }

        server.auth = lemmyAuthToken;

        await addServer(server);

        setLoading(false);
        navigation.replace("Tabs");
    };

    return (
        <KeyboardAwareScrollView style={{backgroundColor: theme.colors.screen[800]}}>
            <LoadingModal loading={loading} />
            <VStack flex={1} pt={10} mb={5} space={"md"} justifyContent={"center"}>
                {
                    sentEmail ? (
                        <VStack px={4} space={"md"}>
                            <Text fontSize={32} textAlign={"center"}>
                                Check Your Email
                            </Text>
                            <Text fontSize={18} textAlign={"center"}>
                                An email was sent to {form.email}. Please verify your account then press log in.
                            </Text>
                            <Button variant={"outline"} onPress={() => Linking.openURL("message://")} disabled={loading}>
                                Open Email App
                            </Button>
                            <Button onPress={() => setReady(true)} disabled={loading}>
                                Log In Now
                            </Button>
                        </VStack>
                    ) : (
                        <>
                            <Text fontSize={32} textAlign={"center"}>
                                Create Account
                            </Text>
                            <CTextInput
                                name={"server"}
                                value={form.server}
                                placeholder={"Server"}
                                label={"Server"}
                                onChange={onFormChange}
                                autoCapitalize={"none"}
                                autoCorrect={false}
                                autoFocus={true}
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
                                name={"email"}
                                value={form.email}
                                placeholder={"Email"}
                                label={"Email"}
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
                            <CTextInput
                                name={"passwordAgain"}
                                value={form.passwordAgain}
                                placeholder={"Confirm Password"}
                                label={"Confirm Password"}
                                onChange={onFormChange}
                                autoCapitalize={"none"}
                                autoCorrect={false}
                                secure
                            />
                            <HStack mx={3}>
                                <Text alignSelf={"center"}>Show NSFW</Text>
                                <Switch
                                    ml={"auto"}
                                    alignSelf={"flex-end"}
                                    value={form.showNsfw}
                                    onValueChange={onSwitchChange}
                                />
                            </HStack>
                            <Button mx={2} disabled={loading} onPress={onPress}>
                                Add Account
                            </Button>
                        </>
                    )
                }

            </VStack>
        </KeyboardAwareScrollView>
    );
};

export default CreateAccountScreen;