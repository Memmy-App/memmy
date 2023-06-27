import React, { useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button, StyleSheet, Switch, TextInput } from "react-native";
import { Icon, IconButton, useTheme, VStack } from "native-base";
import { Section, TableView } from "react-native-tableview-simple";
import { Ionicons } from "@expo/vector-icons";
import CCell from "../../ui/table/CCell";
import LoadingModal from "../../ui/Loading/LoadingModal";
import KeyboardAccessory from "../../ui/KeyboardAccessory";
import useNewPost from "../../hooks/post/useNewPost";

function NewPostScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}) {
  const [selection, setSelection] = useState({
    start: 0,
    end: 0,
  });

  // Hooks
  const newPost = useNewPost(
    Number(route.params.communityId),
    route.params.communityLanguageId
      ? Number(route.params.communityLanguageId)
      : undefined
  );

  // Other hooks
  const theme = useTheme();

  const headerLeft = () => (
    <Button title="Cancel" onPress={() => navigation.pop()} />
  );
  const headerRight = () => (
    <Button title="Submit" onPress={newPost.doSubmit} />
  );

  useEffect(() => {
    navigation.setOptions({
      headerLeft,
      headerRight,
    });
  }, [newPost.form]);

  const setBody = (text: string) => {
    newPost.onFormChange("body", text);
  };

  return (
    <>
      <KeyboardAwareScrollView
        style={{ backgroundColor: theme.colors.app.bgSecondary }}
      >
        <VStack flex={1} backgroundColor={theme.colors.app.bgSecondary}>
          <TableView>
            <Section header="POST INFO">
              <CCell
                cellContentView={
                  <TextInput
                    style={{
                      fontSize: 16,
                      flex: 1,
                      color: theme.colors.app.textPrimary,
                    }}
                    placeholderTextColor={theme.colors.app.textSecondary}
                    placeholder="Title"
                    value={newPost.form.name}
                    onChangeText={(text) => newPost.onFormChange("name", text)}
                    autoFocus
                    keyboardAppearance={theme.config.initialColorMode}
                  />
                }
              />
              <CCell
                cellStyle="RightDetail"
                cellAccessoryView={
                  <IconButton
                    icon={<Icon as={Ionicons} name="camera" size={6} />}
                    onPress={newPost.doUpload}
                  />
                }
                cellContentView={
                  <TextInput
                    style={{
                      fontSize: 16,
                      flex: 1,
                      color: theme.colors.app.textPrimary,
                    }}
                    placeholderTextColor={theme.colors.app.textSecondary}
                    placeholder="Link"
                    value={newPost.form.url}
                    onChangeText={(text) => newPost.onFormChange("url", text)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardAppearance={theme.config.initialColorMode}
                  />
                }
              />
              <CCell
                cellStyle="RightDetail"
                title="NSFW"
                cellAccessoryView={
                  <Switch
                    value={newPost.form.nsfw}
                    onValueChange={(v) => newPost.onFormChange("nsfw", v)}
                  />
                }
              />
            </Section>
          </TableView>
          <TextInput
            multiline
            placeholder="Type away!"
            placeholderTextColor={theme.colors.app.textSecondary}
            autoCapitalize="sentences"
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.app.bgTertiary,
                color: theme.colors.app.textPrimary,
              },
            ]}
            numberOfLines={20}
            value={newPost.form.body}
            onSelectionChange={(e) => {
              setSelection(e.nativeEvent.selection);
            }}
            onChangeText={(text) => newPost.onFormChange("body", text)}
            keyboardAppearance={theme.config.initialColorMode}
            inputAccessoryViewID="accessory"
            ref={newPost.inputRef}
          />
        </VStack>
        <LoadingModal loading={newPost.loading} />
      </KeyboardAwareScrollView>
      <KeyboardAccessory
        setText={setBody}
        text={newPost.form.body}
        selection={selection}
        inputRef={newPost.inputRef}
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
  },
});

export default NewPostScreen;
