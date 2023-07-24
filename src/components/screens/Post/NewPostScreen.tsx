import React, { useEffect } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button, Switch, TextInput } from "react-native";
import { Icon, VStack } from "@components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";
import { Ionicons } from "@expo/vector-icons";
import IconButtonWithText from "@components/common/IconButtonWithText";
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
  const theme = useAppSelector(selectThemeOptions);

  const headerLeft = () => (
    <Button
      title={t("Cancel")}
      onPress={() => navigation.pop()}
      color={theme.colors.accent}
    />
  );
  const headerRight = () => (
    <Button
      title={t("Submit")}
      onPress={newPost.doSubmit}
      color={theme.colors.accent}
    />
  );

  useEffect(() => {
    navigation.setOptions({
      headerLeft,
      headerRight,
    });
  }, [newPost.form]);

  return (
    <KeyboardAwareScrollView style={{ backgroundColor: theme.colors.bg }}>
      <VStack flex={1} backgroundColor={theme.colors.bg}>
        <CTable>
          <CSection header={t("post.header")}>
            <CCell
              cellContentView={
                <TextInput
                  style={{
                    fontSize: 16,
                    flex: 1,
                    color: theme.colors.textPrimary,
                  }}
                  placeholderTextColor={theme.colors.textSecondary}
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
                <IconButtonWithText
                  onPressHandler={newPost.doUpload}
                  size="3xl"
                  icon={
                    <Icon
                      as={Ionicons}
                      name="camera"
                      color={theme.colors.accent}
                      size="2xl"
                    />
                  }
                />
              }
              cellContentView={
                <TextInput
                  style={{
                    fontSize: 16,
                    flex: 1,
                    color: theme.colors.textPrimary,
                  }}
                  placeholderTextColor={theme.colors.textSecondary}
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
