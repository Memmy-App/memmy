import React, { useEffect } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button, Switch, TextInput } from "react-native";
import { Icon, IconButton, useTheme, VStack } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import CCell from "../../common/Table/CCell";
import LoadingModal from "../../common/Loading/LoadingModal";
import useNewPost from "../../../hooks/post/useNewPost";
import CTable from "../../common/Table/CTable";
import CSection from "../../common/Table/CSection";

function NewPostScreen({
  route,
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}) {
  // Hooks
  const newPost = useNewPost();

  useEffect(() => {
    newPost.onFormChange("body", route.params.body);
  }, [route.params.body]);

  // Other hooks
  const { t } = useTranslation();
  const theme = useTheme();

  const headerLeft = () => (
    <Button
      title={t("Cancel")}
      onPress={() => navigation.pop()}
      color={theme.colors.app.accent}
    />
  );
  const headerRight = () => (
    <Button
      title={t("Submit")}
      onPress={newPost.doSubmit}
      color={theme.colors.app.accent}
    />
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
          <CSection header={t("post.header")}>
            <CCell
              cellContentView={
                <TextInput
                  style={{
                    fontSize: 16,
                    flex: 1,
                    color: theme.colors.app.textPrimary,
                  }}
                  placeholderTextColor={theme.colors.app.textSecondary}
                  placeholder={t("post.title")}
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
                  icon={
                    <Icon
                      as={Ionicons}
                      name="camera"
                      size={6}
                      color={theme.colors.app.accent}
                    />
                  }
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
                  placeholder={t("post.link")}
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
              title={newPost.form.body ? newPost.form.body : t("post.body")}
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
              title={t("NSFW")}
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
