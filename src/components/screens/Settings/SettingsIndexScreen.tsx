import FastImage from "@gkasdorf/react-native-fast-image";
import { TableView } from "@gkasdorf/react-native-tableview-simple";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Box,
  HStack,
  ScrollView,
  Text,
} from "@src/components/common/Gluestack";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking, StyleSheet } from "react-native";
import { Divider } from "react-native-elements";
import { modelName, osVersion } from "expo-device";
import { getReadableVersion } from "react-native-device-info";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import { openLink } from "@src/helpers/LinkHelper";
import { ICON_MAP } from "../../../constants/IconMap";
import { deleteLog, sendLog, writeToLog } from "../../../helpers/LogHelper";
import CCell from "../../common/Table/CCell";
import CSection from "../../common/Table/CSection";
import SFIcon from "../../common/icons/SFIcon";
import { GITHUB_LINK } from "../../../constants/Links";
import { AppContextMenuButton } from "../../common/ContextMenu/App/AppContextMenuButton";

function SettingOptionTitle({
  text,
  icon,
  iconBgColor,
}: {
  text: string;
  icon: string;
  iconBgColor: string;
}) {
  return (
    <HStack space="md" alignItems="center" marginBottom={-1.5}>
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
        <SFIcon color="#fff" icon={icon} size={12} boxSize={20} />
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
  const theme = useThemeOptions();

  const languages = useMemo<string[]>(
    () => Object.keys(i18n.options.resources),
    [i18n]
  );

  const onCacheClear = async () => {
    await FastImage.clearDiskCache();
    Alert.alert(t("alert.title.success"), t("alert.message.cacheCleared"));
  };

  const onEmailDebugLogPress = () => {
    sendLog()
      .then()
      .catch((e) => {
        if (e.toString() === "Error: no_file") {
          Alert.alert(t("alert.title.noDebugLog"));
        } else {
          Alert.alert(e.toString());
        }
      });
  };

  const onReportBugPress = () => {
    const params = new URLSearchParams();
    params.append("assignees", "");
    params.append("labels", "bug,triage");
    params.append("projects", "");
    params.append("template", "bug_report.yml");
    params.append("title", "[Bug] ");
    params.append("version", getReadableVersion());
    params.append("device", modelName);
    params.append("osVersion", osVersion);
    Linking.openURL(`${GITHUB_LINK}/issues/new?${params.toString()}`);
  };

  const languageOptions = useMemo(
    () => [
      ...languages.map((language) => ({
        key: language,
        title: t(language),
      })),
    ],
    [t, languages]
  );

  return (
    <ScrollView bg={theme.colors.bg} flex={1}>
      <TableView style={styles.table}>
        <CSection>
          <CCell
            cellStyle="Basic"
            title={
              <SettingOptionTitle
                text={t("General")}
                icon="gear"
                iconBgColor="#FF8E00"
              />
            }
            accessory="DisclosureIndicator"
            onPress={() => navigation.push("GeneralSettings")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
          />
          <CCell
            cellStyle="Basic"
            title={
              <SettingOptionTitle
                text={t("Content")}
                icon={ICON_MAP.REPLY}
                iconBgColor="#F43A9F"
              />
            }
            accessory="DisclosureIndicator"
            onPress={() => navigation.push("Content")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
          />
          <CCell
            cellStyle="Basic"
            title={
              <SettingOptionTitle
                text={t("Appearance")}
                icon="paintbrush"
                iconBgColor="#BB4BE5"
              />
            }
            accessory="DisclosureIndicator"
            onPress={() => navigation.push("Appearance")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
          />
          <CCell
            cellStyle="Basic"
            title={
              <SettingOptionTitle
                text={t("Accounts")}
                icon={ICON_MAP.USER_AVATAR}
                iconBgColor="#00CA48"
              />
            }
            accessory="DisclosureIndicator"
            onPress={() => navigation.push("ViewAccounts")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
          />
          <CCell
            cellStyle="Basic"
            title={
              <SettingOptionTitle
                text={t("Filters")}
                icon={ICON_MAP.FILTERS}
                iconBgColor="#ed5a6e"
              />
            }
            accessory="DisclosureIndicator"
            onPress={() => navigation.push("Filters")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
          />
          <CCell
            cellStyle="Basic"
            title={
              <SettingOptionTitle
                text={t("About")}
                icon="at"
                iconBgColor="#0368D4"
              />
            }
            accessory="DisclosureIndicator"
            onPress={() => navigation.push("About")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
          />
        </CSection>

        <CSection>
          <CCell
            cellStyle="Basic"
            title={t("Email Debug Log")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            accessory="DisclosureIndicator"
            onPress={onEmailDebugLogPress}
          />
          <CCell
            cellStyle="Basic"
            title={t("Clear Debug Log")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
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
          <CCell
            cellStyle="Basic"
            title={t("settings.reportBugBtn")}
            onPress={onReportBugPress}
            cellAccessoryView={
              <SFIcon
                icon={ICON_MAP.EXTERNAL_LINK}
                color={theme.colors.textSecondary}
              />
            }
          />
          <CCell
            cellStyle="Basic"
            title={t("settings.checkInstanceStatus")}
            onPress={() => {
              openLink("http://lemmy-status.org/", navigation);
            }}
            cellAccessoryView={
              <SFIcon
                icon={ICON_MAP.EXTERNAL_LINK}
                color={theme.colors.textSecondary}
              />
            }
          />
        </CSection>

        {__DEV__ && (
          <>
            <Divider style={{ margin: 20 }} />
            <CSection header="🛠️ DEV TOOLS">
              <AppContextMenuButton
                options={languageOptions}
                selection={i18n.resolvedLanguage}
                onPressMenuItem={({ nativeEvent }) => {
                  i18n.changeLanguage(nativeEvent.actionKey);
                }}
              >
                <CCell
                  cellStyle="RightDetail"
                  title={t("Select Language")}
                  detail={i18n.language}
                  backgroundColor={theme.colors.fg}
                  titleTextColor={theme.colors.textPrimary}
                  rightDetailColor={theme.colors.textSecondary}
                  accessory="DisclosureIndicator"
                />
              </AppContextMenuButton>
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
