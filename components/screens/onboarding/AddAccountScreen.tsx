import React, {useState} from "react";
import {Button, Text, useTheme, useToast, VStack} from "native-base";
import {Alert} from "react-native";
import CTextInput from "../../ui/CTextInput";
import ILemmyServer from "../../../lemmy/types/ILemmyServer";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {initialize, lemmyAuthToken} from "../../../lemmy/LemmyInstance";
import LoadingModal from "../../ui/Loading/LoadingModal";
import {useAppDispatch} from "../../../store";
import {getBaseUrl} from "../../../helpers/LinkHelper";
import {addAccount} from "../../../slices/accounts/accountsActions";

const AddAccountScreen = () => {
    const [form, setForm] = useState<ILemmyServer>({
        server: "",
        username: "",
        password: "",
        auth: "",
        totpToken: ""
    });
    const [loading, setLoading] = useState(false);
    const [showTotpToken, setShowTotpToken] = useState(false);

    const toast = useToast();
    const theme = useTheme();
    const dispatch = useAppDispatch();

    const onFormChange = (name, value) => {
        setForm({
            ...form,
            [name]: value
        });
    };

    const doLogin = async () => {
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
            totpToken: form.totpToken
        };

        try {
            setLoading(true);

            await initialize(server);
        } catch(e) {
            if (e === "missing_totp_token") {
                setShowTotpToken(true);
            } else {
                Alert.alert("Error", e.toString());
            }
            setLoading(false);
            return;
        }

        if(!lemmyAuthToken) {
            Alert.alert("Error", "Did not receive authentication response.");
            return;
        }
    };

    const onPress = () => {
        doLogin().then(() => {
            if(!lemmyAuthToken) return;

            dispatch(addAccount({
                username: form.username,
                password: form.password,
                instance: getBaseUrl(form.server),
                token: lemmyAuthToken,
            }));

            setLoading(false);
        });
    };

    return (
        <KeyboardAwareScrollView style={{backgroundColor: theme.colors.screen[800]}}>
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
                    name={"password"}
                    value={form.password}
                    placeholder={"Password"}
                    label={"Password"}
                    onChange={onFormChange}
                    autoCapitalize={"none"}
                    autoCorrect={false}
                    secure
                />
                {
                    showTotpToken && (
                        <CTextInput
                            name={"totpToken"}
                            value={form.totpToken}
                            placeholder={"2FA Token"}
                            label={"2FA Token"}
                            onChange={onFormChange}
                            autoCapitalize={"none"}
                            autoCorrect={false}
                            autoFocus={showTotpToken}
                            secure
                        />
                    )
                }
                <Button mx={2} disabled={loading} onPress={onPress}>
                    Add Account
                </Button>
            </VStack>
        </KeyboardAwareScrollView>
    );
};

export default AddAccountScreen;
