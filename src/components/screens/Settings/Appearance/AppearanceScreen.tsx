import { useActionSheet } from "@expo/react-native-action-sheet";
import { TableView } from "@gkasdorf/react-native-tableview-simple";
import Slider from "@react-native-community/slider";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Box, HStack, ScrollView, Text, useTheme } from "native-base";
import React, { useState } from "react";
import { LayoutAnimation, StyleSheet, Switch } from "react-native";
import { useTranslation } from "react-i18next";
import { setSetting } from "../../../../slices/settings/settingsActions";
import { selectSettings } from "../../../../slices/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { FontWeightMap } from "../../../../theme/fontSize";
import Chip from "../../../common/Chip";
import CCell from "../../../common/Table/CCell";
import CSection from "../../../common/Table/CSection";
import CTextInput from "../../../common/CTextInput";
import { showToast } from "../../../../slices/toast/toastSlice";
import { appIconOptions } from "../../../../types/AppIconType";

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

function AppearanceScreen({ navigation }: IProps) {
  const settings = useAppSelector(selectSettings);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { showActionSheetWithOptions } = useActionSheet();

  const onChange = (key: string, value: any) => {
    dispatch(setSetting({ [key]: value }));
  };

  const [accent, setAccent] = useState(settings.accentColor);
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  return (
    <ScrollView backgroundColor={theme.colors.app.bg} flex={1}>
      <TableView style={styles.table}>
        <CSection
          header={t("settings.appearance.appIcon")}
          footer="App icons by dizzy@lemmy.ml"
        >
          <CCell
            cellStyle="RightDetail"
            title={t("settings.appearance.appIcon")}
            detail={appIconOptions[settings.appIcon].display}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            accessory="DisclosureIndicator"
            onPress={() => navigation.push("IconSelection")}
          />
        </CSection>
        <CSection header="Content">
          <CCell
            cellStyle="Basic"
            title={t("settings.appearance.totalScore")}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.displayTotalScore}
                onValueChange={(v) => {
                  LayoutAnimation.easeInEaseOut();
                  onChange("displayTotalScore", v);
                }}
              />
            }
          />
          <CCell
            cellStyle="Basic"
            title={t("settings.appearance.imgIgnoreScreenHeight")}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.ignoreScreenHeightInFeed}
                onValueChange={(v) => {
                  LayoutAnimation.easeInEaseOut();
                  onChange("ignoreScreenHeightInFeed", v);
                }}
              />
            }
          />
          <CCell
            cellStyle="RightDetail"
            title={t("settings.appearance.showUserInstance")}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.showInstanceForUsernames}
                onValueChange={(v) => onChange("showInstanceForUsernames", v)}
              />
            }
          />
          <CCell
            cellStyle="RightDetail"
            title={t("settings.appearance.compactView")}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.compactView}
                onValueChange={(v) => {
                  LayoutAnimation.easeInEaseOut();
                  onChange("compactView", v);
                }}
              />
            }
          />
        </CSection>

        {settings.compactView && (
          <CSection header={t("settings.appearance.compact.header")}>
            <CCell
              cellStyle="RightDetail"
              title={t("settings.appearance.compact.thumbPos")}
              detail={settings.compactThumbnailPosition}
              accessory="DisclosureIndicator"
              onPress={() => {
                const options = ["None", "Left", "Right", "Cancel"];
                const cancelButtonIndex = 3;

                showActionSheetWithOptions(
                  {
                    options,
                    cancelButtonIndex,
                    userInterfaceStyle: theme.config.initialColorMode,
                  },
                  (index: number) => {
                    if (index === cancelButtonIndex) return;

                    dispatch(
                      setSetting({ compactThumbnailPosition: options[index] })
                    );
                  }
                );
              }}
            />
            <CCell
              cellStyle="RightDetail"
              title={t("settings.appearance.compact.showVotingButtons")}
              backgroundColor={theme.colors.app.fg}
              titleTextColor={theme.colors.app.textPrimary}
              rightDetailColor={theme.colors.app.textSecondary}
              cellAccessoryView={
                <Switch
                  value={settings.compactShowVotingButtons}
                  onValueChange={(v) => onChange("compactShowVotingButtons", v)}
                />
              }
            />
          </CSection>
        )}

        <CSection header={t("settings.appearance.gestures.header")}>
          <CCell
            cellStyle="Basic"
            title={t("settings.appearance.gestures.tapToCollapse")}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.tapToCollapse}
                onValueChange={(v) => onChange("tapToCollapse", v)}
              />
            }
          />
        </CSection>

        <CSection header={t("settings.appearance.themes.header")}>
          <CCell
            cellStyle="Basic"
            title={t("settings.appearance.themes.matchSystem")}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.themeMatchSystem}
                onValueChange={(v) => {
                  LayoutAnimation.easeInEaseOut();
                  onChange("themeMatchSystem", v);
                }}
              />
            }
          />
          {!settings.themeMatchSystem && (
            <CCell
              cellStyle="Basic"
              title={t("Theme")}
              accessory="DisclosureIndicator"
              onPress={() => navigation.push("ThemeSelection")}
              backgroundColor={theme.colors.app.fg}
              titleTextColor={theme.colors.app.textPrimary}
              rightDetailColor={theme.colors.app.textSecondary}
            >
              <Text
                ml={4}
                mb={2}
                mt={-3}
                fontSize="xs"
                color={theme.colors.app.textSecondary}
              >
                {`${t("Selected")}: ${settings.theme}`}
              </Text>
            </CCell>
          )}
          {settings.themeMatchSystem && (
            <CCell
              cellStyle="Basic"
              title={t("settings.appearance.themes.systemLight")}
              accessory="DisclosureIndicator"
              onPress={() =>
                navigation.push("ThemeSelection", { themeProp: "themeLight" })
              }
              backgroundColor={theme.colors.app.fg}
              titleTextColor={theme.colors.app.textPrimary}
              rightDetailColor={theme.colors.app.textSecondary}
            >
              <Text
                ml={4}
                mb={2}
                mt={-3}
                fontSize="xs"
                color={theme.colors.app.textSecondary}
              >
                Selected: {settings.themeLight}
              </Text>
            </CCell>
          )}
          {settings.themeMatchSystem && (
            <CCell
              cellStyle="Basic"
              title={t("settings.appearance.themes.systemDark")}
              accessory="DisclosureIndicator"
              onPress={() =>
                navigation.push("ThemeSelection", { themeProp: "themeDark" })
              }
              backgroundColor={theme.colors.app.fg}
              titleTextColor={theme.colors.app.textPrimary}
              rightDetailColor={theme.colors.app.textSecondary}
            >
              <Text
                ml={4}
                mb={2}
                mt={-3}
                fontSize="xs"
                color={theme.colors.app.textSecondary}
              >
                Selected: {settings.themeDark}
              </Text>
            </CCell>
          )}

          <CCell
            cellStyle="RightDetail"
            title={
              <Text>
                {`${t("Accent Color")}  `}
                <Chip
                  text="Alpha"
                  color={theme.colors.app.info}
                  variant="outlined"
                />
              </Text>
            }
            cellAccessoryView={
              <CTextInput
                style={{ minWidth: "40%" }}
                name="Hex Code"
                value={accent}
                onChange={(name, value) => {
                  setAccent(value);
                }}
                onEnd={() => {
                  let hexToCheck = accent;

                  if (hexToCheck && !hexToCheck.includes("#")) {
                    hexToCheck = `#${hexToCheck}`;
                  }

                  if (hexPattern.test(hexToCheck)) {
                    if (hexToCheck !== settings.accentColor) {
                      dispatch(
                        showToast({
                          message: t("toast.accentColorUpdated"),
                          duration: 3000,
                          variant: "info",
                        })
                      );
                    }
                    dispatch(setSetting({ accentColor: hexToCheck }));
                  } else {
                    setAccent("");
                    dispatch(setSetting({ accentColor: "" }));
                    dispatch(
                      showToast({
                        message: t("toast.accentColorInvalidHexCode"),
                        duration: 3000,
                        variant: "error",
                      })
                    );
                  }
                }}
                placeholder={t(
                  "settings.appearance.themes.hexCode.placeholder"
                )}
                autoCapitalize="none"
                autoCorrect={false}
              />
            }
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
          />
        </CSection>

        <CSection header={t("settings.appearance.font.header")}>
          <CCell
            title={t("settings.appearance.font.useSystemFont")}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.isSystemFont}
                onValueChange={(v) => onChange("isSystemFont", v)}
              />
            }
          />
          <CCell
            title={t("settings.appearance.font.useSystemFontSize")}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.isSystemTextSize}
                onValueChange={(v) => onChange("isSystemTextSize", v)}
              />
            }
          />
          <CCell
            isDisabled={settings.isSystemTextSize}
            title={
              <Text>
                {`${t("settings.appearance.font.textSize")}  `}
                <Chip
                  text="Alpha"
                  color={theme.colors.app.info}
                  variant="outlined"
                />
              </Text>
            }
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
          >
            <HStack width="100%" alignItems="center" px={6}>
              <Text fontSize={13}>A</Text>
              <Box flex={1}>
                <Slider
                  disabled={settings.isSystemTextSize}
                  style={{ height: 40, marginHorizontal: 20, marginBottom: 5 }}
                  minimumValue={1}
                  maximumValue={7}
                  thumbTintColor={theme.colors.app.textPrimary}
                  minimumTrackTintColor={theme.colors.app.textPrimary}
                  maximumTrackTintColor={theme.colors.app.textPrimary}
                  step={1}
                  value={settings.fontSize}
                  onSlidingComplete={(v) => onChange("fontSize", v)}
                />
              </Box>
              <Text fontSize={19}>A</Text>
            </HStack>
          </CCell>
          <CCell
            cellStyle="RightDetail"
            title={t("settings.appearance.font.postTitleFontWeight")}
            detail={
              Object.keys(FontWeightMap).find(
                (key) => FontWeightMap[key] === settings.fontWeightPostTitle
              ) || "Regular"
            }
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            accessory="DisclosureIndicator"
            onPress={() => {
              const options = [...Object.keys(FontWeightMap), "Cancel"];
              const cancelButtonIndex = options.length - 1;

              showActionSheetWithOptions(
                {
                  options,
                  cancelButtonIndex,
                  userInterfaceStyle: theme.config.initialColorMode,
                },
                (index: number) => {
                  if (index === cancelButtonIndex) return;

                  dispatch(
                    setSetting({
                      fontWeightPostTitle: FontWeightMap[options[index]] || 400,
                    })
                  );
                }
              );
            }}
          />
        </CSection>
      </TableView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  table: {
    marginHorizontal: 15,
  },
});

export default AppearanceScreen;
