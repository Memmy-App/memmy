import { useActionSheet } from "@expo/react-native-action-sheet";
import { TableView } from "@gkasdorf/react-native-tableview-simple";
import Slider from "@react-native-community/slider";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Box, HStack, ScrollView, Text, useTheme } from "native-base";
import React from "react";
import { LayoutAnimation, StyleSheet, Switch } from "react-native";
import { setSetting } from "../../../../slices/settings/settingsActions";
import { selectSettings } from "../../../../slices/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { FontWeightMap } from "../../../../theme/fontSize";
import Chip from "../../../ui/common/Chip";
import CCell from "../../../ui/table/CCell";
import CSection from "../../../ui/table/CSection";

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
                <Chip text="Alpha" />
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
