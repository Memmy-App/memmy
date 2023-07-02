import React, { useEffect } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button, Switch, TextInput } from "react-native";
import { Icon, IconButton, useTheme, VStack } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import CCell from "../../ui/table/CCell";
import LoadingModal from "../../ui/Loading/LoadingModal";
import useNewPost from "../../hooks/post/useNewPost";
import CTable from "../../ui/table/CTable";
import CSection from "../../ui/table/CSection";

function NewPostScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}) {
  // Hooks
  const newPost = useNewPost(
    Number(route.params.communityId),
    route.params.communityLanguageId
      ? Number(route.params.communityLanguageId)
      : 0
  );

  useEffect(() => {
    newPost.onFormChange("body", route.params.body);
  }, [route.params.body]);

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

  return (
    <KeyboardAwareScrollView style={{ backgroundColor: theme.colors.app.bg }}>
      <VStack flex={1} backgroundColor={theme.colors.app.bg}>
        <CTable>
          <CSection header="POST INFO">
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
                  placeholder="Link (optional)"
                  value={newPost.form.url}
                  onChangeText={(text) => newPost.onFormChange("url", text)}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardAppearance={theme.config.initialColorMode}
                />
              }
            />
            <CCell
              cellStyle="Basic"
              title={newPost.form.body ? newPost.form.body : "Body (optional)"}
              onPress={() =>
                navigation.push("NewPostBody", {
                  ...route.params,
                  body: newPost.form.body,
                })
              }
              accessory="DisclosureIndicator"
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
          </CSection>
        </CTable>
      </VStack>
      <LoadingModal loading={newPost.loading} />
    </KeyboardAwareScrollView>
  );
}

export default NewPostScreen;
