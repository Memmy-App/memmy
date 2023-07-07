import { useActionSheet } from "@expo/react-native-action-sheet";
import { TableView } from "@gkasdorf/react-native-tableview-simple";
import Slider from "@react-native-community/slider";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Box, HStack, ScrollView, Text, useTheme } from "native-base";
import React, { useState } from "react";
import { LayoutAnimation, StyleSheet, Switch } from "react-native";
import { setSetting } from "../../../../slices/settings/settingsActions";
import { selectSettings } from "../../../../slices/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { FontWeightMap } from "../../../../theme/fontSize";
import Chip from "../../../ui/common/Chip";
import CCell from "../../../ui/Table/CCell";
import CSection from "../../../ui/Table/CSection";
import CTextInput from "../../../ui/CTextInput";
import { showToast } from "../../../../slices/toast/toastSlice";

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

function AppearanceScreen({ navigation }: IProps) {
  const settings = useAppSelector(selectSettings);

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
        <CSection header="THEMES">
          <CCell
            cellStyle="Basic"
            title="Match System Light/Dark Theme"
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
              title="Theme"
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
                Selected: {settings.theme}
              </Text>
            </CCell>
          )}
          {settings.themeMatchSystem && (
            <CCell
              cellStyle="Basic"
              title="Theme for System Light"
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
              title="Theme for System Dark"
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
                Accent Color{"  "}
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
                          message: "Accent color updated",
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
                        message: "Accent color is not a valid hex code",
                        duration: 3000,
                        variant: "error",
                      })
                    );
                  }
                }}
                placeholder="Input a hex code"
                autoCapitalize="none"
                autoCorrect={false}
              />
            }
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
          />
        </CSection>

        <CSection header="FONT">
          <CCell
            title="Use System Font"
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
            title="Use System Font Size"
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
                Text Size{"  "}
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
            title="Font Weight - Post Title"
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
