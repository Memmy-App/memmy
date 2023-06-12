import React, {useEffect, useState} from "react";
import {Input, Text, View, VStack, Stack, FormControl, Button} from "native-base";
import {StyleSheet} from "react-native";
import CTextInput from "../../ui/CTextInput";
import ILemmyServer from "../../lemmy/types/ILemmyServer";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

const AddAccountScreen = () => {
    const [form, setForm] = useState<ILemmyServer>({
        server: "",
        username: "",
        password: "",
        auth: ""
    });

    const onFormChange = (name, value) => {
        setForm({
            ...form,
            [name]: value
        });
    };

    return (
        <KeyboardAwareScrollView>
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
                <Button mx={2}>
                    Add Account
                </Button>
            </VStack>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({

});

export default AddAccountScreen;