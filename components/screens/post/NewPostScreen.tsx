import React, { useEffect, useRef, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Alert, Button, StyleSheet, Switch, TextInput } from "react-native";
import { Icon, IconButton, useColorMode, useTheme, VStack } from "native-base";
import { CreatePost } from "lemmy-js-client";
import { Section, TableView } from "react-native-tableview-simple";
import { Ionicons } from "@expo/vector-icons";
import CCell from "../../ui/table/CCell";
import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";
import LoadingModal from "../../ui/Loading/LoadingModal";
import KeyboardAccessory from "../../ui/KeyboardAccessory";
import { selectImage } from "../../../helpers/ImageHelper";
import uploadToImgur from "../../../helpers/ImgurHelper";
import { setPost } from "../../../slices/post/postSlice";
import { useAppDispatch } from "../../../store";

function NewPostScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}) {
  const [form, setForm] = useState({
    body: "",
    name: "",
    url: "",
    nsfw: false,
    auth: lemmyAuthToken,
    community_id: route.params.communityId,
    language_id: 37,
  } as CreatePost);

  const [selection, setSelection] = useState({
    start: 0,
    end: 0,
  });

  const [loading, setLoading] = useState(false);

  const inputRef = useRef<TextInput>();

  const theme = useTheme();
  const colorMode = useColorMode();
  const dispatch = useAppDispatch();

  const headerLeft = () => (
    <Button title="Cancel" onPress={() => navigation.pop()} />
  );
  const headerRight = () => <Button title="Submit" onPress={doSubmit} />;

  useEffect(() => {
    navigation.setOptions({
      headerLeft,
      headerRight,
    });
  }, [form]);

  const onFormChange = (name: string, value: string | boolean) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const setBody = (text: string) => {
    onFormChange("body", text);
  };

  const doUpload = async () => {
    let path;

    try {
      path = await selectImage();
    } catch (e) {
      if (e === "permissions") {
        Alert.alert(
          "Permissions Error",
          "Please allow Memmy App to access your camera roll."
        );
        return;
      }
    }

    setLoading(true);

    let imgurLink;

    try {
      imgurLink = await uploadToImgur(path);
    } catch (e) {
      Alert.alert("Error", "Error uploading image to Imgur.");
    }

    onFormChange("url", imgurLink);
    setLoading(false);
  };

  const doSubmit = async () => {
    try {
      setLoading(true);

      const prepared: CreatePost = {
        ...form,
        name: form.name !== "" ? form.name : undefined,
        body: form.body !== "" ? form.body : undefined,
        url: form.url !== "" ? form.url : undefined,
      };

      const res = await lemmyInstance.createPost(prepared);

      setLoading(false);

      dispatch(setPost(res.post_view));

      navigation.pop();
    } catch (e) {
      setLoading(false);
      Alert.alert(e.toString());
    }
  };

  return (
    <>
      <KeyboardAwareScrollView
        style={{ backgroundColor: theme.colors.screen[800] }}
      >
        <VStack flex={1} backgroundColor="screen.800">
          <TableView>
            <Section header="POST INFO">
              <CCell
                cellContentView={
                  <TextInput
                    style={{
                      fontSize: 16,
                      flex: 1,
                      color: theme.colors.lightText,
                    }}
                    placeholderTextColor={theme.colors.screen["400"]}
                    placeholder="Title"
                    value={form.name}
                    onChangeText={(text) => onFormChange("name", text)}
                    autoFocus
                  />
                }
              />
              <CCell
                cellStyle="RightDetail"
                cellAccessoryView={
                  <IconButton
                    icon={<Icon as={Ionicons} name="camera" size={6} />}
                    onPress={doUpload}
                  />
                }
                cellContentView={
                  <TextInput
                    style={{
                      fontSize: 16,
                      flex: 1,
                      color: theme.colors.lightText,
                    }}
                    placeholderTextColor={theme.colors.screen["400"]}
                    placeholder="Link"
                    value={form.url}
                    onChangeText={(text) => onFormChange("url", text)}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                }
              />
              <CCell
                cellStyle="RightDetail"
                title="NSFW"
                cellAccessoryView={
                  <Switch
                    value={form.nsfw}
                    onValueChange={(v) => onFormChange("nsfw", v)}
                  />
                }
              />
            </Section>
          </TableView>
          <TextInput
            multiline
            placeholder="Type away!"
            placeholderTextColor={theme.colors.screen["400"]}
            autoCapitalize="sentences"
            style={[
              styles.input,
              { backgroundColor: theme.colors.screen["700"] },
            ]}
            numberOfLines={20}
            value={form.body}
            onSelectionChange={(e) => {
              setSelection(e.nativeEvent.selection);
            }}
            onChangeText={(text) => onFormChange("body", text)}
            keyboardAppearance={colorMode.colorMode}
            inputAccessoryViewID="accessory"
            ref={inputRef}
          />
        </VStack>
        <LoadingModal loading={loading} />
      </KeyboardAwareScrollView>
      <KeyboardAccessory
        setText={setBody}
        text={form.body}
        selection={selection}
        inputRef={inputRef}
      />
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    alignSelf: "stretch",
    padding: 10,
    paddingTop: 15,
    height: 200,
    fontSize: 16,
    color: "#fff",
  },
});

export default NewPostScreen;
