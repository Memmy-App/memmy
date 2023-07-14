import { TableView } from "@gkasdorf/react-native-tableview-simple";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Box, HStack, ScrollView, Text, useTheme } from "native-base";
import React, { useMemo } from "react";
import { Alert, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import {
  IconAt,
  IconBrush,
  IconMessage,
  IconSettings,
  IconUser,
  TablerIcon,
} from "tabler-icons-react-native";
import { useTranslation } from "react-i18next";
import { Divider } from "react-native-elements";
import { deleteLog, sendLog, writeToLog } from "../../../helpers/LogHelper";
import CCell from "../../common/Table/CCell";
import CSection from "../../common/Table/CSection";
import { useAppActionSheet } from "../../../hooks/app/useAppActionSheet";

function SettingOptionTitle({
  text,
  icon,
  iconBgColor,
}: {
  text: string;
  icon: TablerIcon;
  iconBgColor: string;
}) {
  const IconComponent = icon;

  return (
    <HStack space={3} alignItems="center" marginBottom={-1.5}>
      <Box
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          backgroundColor: iconBgColor,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IconComponent color="#fff" size={20} />
      </Box>
      <Text>{text}</Text>
    </HStack>
  );
}

function SettingsIndexScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const { showAppActionSheetWithOptions } = useAppActionSheet();

  const languages = useMemo<string[]>(
    () => Object.keys(i18n.options.resources),
    [i18n]
  );

  const onCacheClear = async () => {
    await FastImage.clearDiskCache();
    Alert.alert(t("alert.title.success"), t("alert.message.cacheCleared"));
  };

  return (
    <ScrollView backgroundColor={theme.colors.app.bg} flex={1}>
      <TableView style={styles.table}>
        <CSection>
          <CCell
            cellStyle="Basic"
            title={
              <SettingOptionTitle
                text={t("General")}
                icon={IconSettings}
                iconBgColor="#FF8E00"
              />
            }
            accessory="DisclosureIndicator"
            onPress={() => navigation.push("GeneralSettings")}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
          />
          <CCell
            cellStyle="Basic"
            title={
              <SettingOptionTitle
                text={t("Content")}
                icon={IconMessage}
                iconBgColor="#F43A9F"
              />
            }
            accessory="DisclosureIndicator"
            onPress={() => navigation.push("Content")}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
          />
          <CCell
            cellStyle="Basic"
            title={
              <SettingOptionTitle
                text={t("Appearance")}
                icon={IconBrush}
                iconBgColor="#BB4BE5"
              />
            }
            accessory="DisclosureIndicator"
            onPress={() => navigation.push("Appearance")}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
          />
          <CCell
            cellStyle="Basic"
            title={
              <SettingOptionTitle
                text={t("Accounts")}
                icon={IconUser}
                iconBgColor="#00CA48"
              />
            }
            accessory="DisclosureIndicator"
            onPress={() => navigation.push("ViewAccounts")}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
          />
          <CCell
            cellStyle="Basic"
            title={
              <SettingOptionTitle
                text={t("About")}
                icon={IconAt}
                iconBgColor="#0368D4"
              />
            }
            accessory="DisclosureIndicator"
            onPress={() => navigation.push("About")}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
          />
        </CSection>

        <CSection>
          <CCell
            cellStyle="Basic"
            title={t("Email Debug Log")}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            accessory="DisclosureIndicator"
            onPress={() => {
              sendLog()
                .then()
                .catch((e) => {
                  if (e.toString() === "Error: no_file") {
                    Alert.alert(t("alert.title.noDebugLog"));
                  } else {
                    Alert.alert(e.toString());
                  }
                });
            }}
          />
          <CCell
            cellStyle="Basic"
            title={t("Clear Debug Log")}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            accessory="DisclosureIndicator"
            onPress={() => {
              try {
                deleteLog();
                Alert.alert(t("alert.title.debugFileCleared"));
              } catch (e) {
                writeToLog("Error clearing debug file.");
              }
            }}
          />
          <CCell
            cellStyle="Basic"
            title={t("Clear Cache")}
            accessory="DisclosureIndicator"
            onPress={() => {
              // TODO this is a hack to shut eslint up. PR was merged to accept promises here, so we can upgrade to the
              // version on git or just remove this table stuff and use the new MTable
              onCacheClear();
            }}
          />
        </CSection>

        {__DEV__ && (
          <>
            <Divider style={{ margin: 20 }} />
            <CSection header="🛠️ DEV TOOLS">
              <CCell
                cellStyle="RightDetail"
                title={t("Select Language")}
                detail={i18n.language}
                backgroundColor={theme.colors.app.fg}
                titleTextColor={theme.colors.app.textPrimary}
                rightDetailColor={theme.colors.app.textSecondary}
                accessory="DisclosureIndicator"
                onPress={() => {
                  const filteredLanguages = languages.filter(
                    (language) => language !== i18n.language
                  );
                  const options = [...filteredLanguages, "Cancel"];
                  const cancelButtonIndex = options.length - 1;

                  showAppActionSheetWithOptions(
                    {
                      options,
                      cancelButtonIndex,
                    },
                    (index: number) => {
                      const nextLanguage = options[index];
                      i18n.changeLanguage(nextLanguage);
                    }
                  );
                }}
              />
            </CSection>
          </>
        )}
      </TableView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  table: {
    marginHorizontal: 15,
  },
});

export default SettingsIndexScreen;
