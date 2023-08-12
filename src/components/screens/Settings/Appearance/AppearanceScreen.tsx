import {
  Cell,
  Section,
  TableView,
} from "@gkasdorf/react-native-tableview-simple";
import Slider from "@react-native-community/slider";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Badge,
  Box,
  HStack,
  ScrollView,
  Text,
} from "@src/components/gluestack";
import { FontWeightMap } from "@src/theme/fontSize";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { LayoutAnimation, StyleSheet, Switch } from "react-native";
import {
  useSettingsStore,
  useThemeOptions,
} from "@src/state/settings/settingsStore";
import { setSetting } from "@src/state/settings/actions";
import { appIconOptions, AppIconType } from "@src/types/AppIconType";
import { AppContextMenuButton } from "@src/components/contextMenus/AppContextMenuButton";
import { Input } from "react-native-elements";
import { useShowToast } from "@src/state/toast/toastStore";

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

function AppearanceScreen({ navigation }: IProps): React.JSX.Element {
  const { t } = useTranslation();
  const showToast = useShowToast();
  const theme = useThemeOptions();

  const settings = useSettingsStore();

  const onChange = (key: string, value: any) => {
    setSetting(key, value);
  };

  const selectedFontWeight =
    Object.keys(FontWeightMap).find(
      (key) => FontWeightMap[key] === settings.fontWeightPostTitle
    ) || "Regular";

  const [accent, setAccent] = useState(settings.accentColor);
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  const compactThumbnailPositionOptions = useMemo(
    () => [
      {
        key: "None",
        title: t("None"),
      },
      {
        key: "Left",
        title: t("Left"),
      },
      {
        key: "Right",
        title: t("Right"),
      },
    ],
    [t]
  );

  const fontWeightOptions = useMemo(
    () =>
      Object.keys(FontWeightMap).map((key) => ({
        key,
        title: t(key),
      })),
    [t]
  );

  const commentJumpPlacementOptions = [
    { key: "bottom right", title: "Bottom Right" },
    { key: "bottom left", title: "Bottom Left" },
    { key: "bottom center", title: "Bottom Center" },
  ];

  return (
    <ScrollView bg={theme.colors.bg} flex={1}>
      <TableView style={styles.table}>
        <Section
          header={t("settings.appearance.appIcon")}
          footer="App icons by dizzy@lemmy.ml"
        >
          <Cell
            cellStyle="RightDetail"
            title={t("settings.appearance.appIcon")}
            detail={appIconOptions[settings.appIcon as AppIconType].display}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            accessory="DisclosureIndicator"
            onPress={() => navigation.push("IconSelection")}
          />
        </Section>
        <Section header="Content">
          <Cell
            cellStyle="Basic"
            title={t("settings.appearance.totalScore")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.displayTotalScore}
                onValueChange={(v) => {
                  onChange("displayTotalScore", v);
                }}
              />
            }
          />
          <Cell
            cellStyle="Basic"
            title={t("settings.appearance.imgIgnoreScreenHeight")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.ignoreScreenHeightInFeed}
                onValueChange={(v) => {
                  onChange("ignoreScreenHeightInFeed", v);
                }}
              />
            }
          />
          <Cell
            cellStyle="RightDetail"
            title={t("settings.appearance.showUserInstance")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.showInstanceForUsernames}
                onValueChange={(v) => onChange("showInstanceForUsernames", v)}
              />
            }
          />
          <Cell
            cellStyle="RightDetail"
            title={t("settings.appearance.compactView")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
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
          <Cell
            cellStyle="RightDetail"
            title={t("settings.appearance.showCommentJumpButton")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.showCommentJumpButton}
                onValueChange={(v) => {
                  onChange("showCommentJumpButton", v);
                }}
              />
            }
          />
          <AppContextMenuButton
            options={commentJumpPlacementOptions}
            selection={settings.commentJumpPlacement}
            onPressMenuItem={({ nativeEvent }) => {
              setSetting("commentJumpPlacement", nativeEvent.actionKey);
            }}
          >
            <Cell
              cellStyle="RightDetail"
              title="Comment Jump Placement"
              backgroundColor={theme.colors.fg}
              titleTextColor={theme.colors.textPrimary}
              rightDetailColor={theme.colors.textSecondary}
              accessory="DisclosureIndicator"
              detail={
                commentJumpPlacementOptions.find(
                  (e) => e.key === settings.commentJumpPlacement
                )!.title
              }
            />
          </AppContextMenuButton>
        </Section>
        <Section header="Tab Bar">
          <Cell
            cellStyle="RightDetail"
            title="Hide Username"
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.hideUsernameInTab}
                onValueChange={(v) => {
                  onChange("hideUsernameInTab", v);
                }}
              />
            }
          />
          <Cell
            cellStyle="RightDetail"
            title="Hide Avatar Image"
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.hideAvatarInTab}
                onValueChange={(v) => {
                  onChange("hideAvatarInTab", v);
                }}
              />
            }
          />
        </Section>
        {settings.compactView && (
          <Section header={t("settings.appearance.compact.header")}>
            <AppContextMenuButton
              options={compactThumbnailPositionOptions}
              selection={settings.compactThumbnailPosition}
              onPressMenuItem={({ nativeEvent }) => {
                setSetting("compactThumbnailPosition", nativeEvent.actionKey);
              }}
            >
              <Cell
                cellStyle="RightDetail"
                title={t("settings.appearance.compact.thumbPos")}
                detail={settings.compactThumbnailPosition}
                accessory="DisclosureIndicator"
              />
            </AppContextMenuButton>
            <Cell
              cellStyle="RightDetail"
              title={t("settings.appearance.compact.showVotingButtons")}
              backgroundColor={theme.colors.fg}
              titleTextColor={theme.colors.textPrimary}
              rightDetailColor={theme.colors.textSecondary}
              cellAccessoryView={
                <Switch
                  value={settings.compactShowVotingButtons}
                  onValueChange={(v) => onChange("compactShowVotingButtons", v)}
                />
              }
            />
          </Section>
        )}

        <Section header={t("settings.appearance.themes.header")}>
          <Cell
            cellStyle="Basic"
            title={t("settings.appearance.themes.matchSystem")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
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
            <Cell
              cellStyle="Basic"
              title={t("Theme")}
              accessory="DisclosureIndicator"
              onPress={() => navigation.push("ThemeSelection")}
              backgroundColor={theme.colors.fg}
              titleTextColor={theme.colors.textPrimary}
              rightDetailColor={theme.colors.textSecondary}
            >
              <Text
                ml="$4"
                mb="$2"
                mt={-3}
                size="xs"
                color={theme.colors.textSecondary}
              >
                {`${t("Selected")}: ${settings.theme}`}
              </Text>
            </Cell>
          )}
          {settings.themeMatchSystem && (
            <Cell
              cellStyle="Basic"
              title={t("settings.appearance.themes.systemLight")}
              accessory="DisclosureIndicator"
              onPress={() =>
                navigation.push("ThemeSelection", { themeProp: "themeLight" })
              }
              backgroundColor={theme.colors.fg}
              titleTextColor={theme.colors.textPrimary}
              rightDetailColor={theme.colors.textSecondary}
            >
              <Text
                ml="$4"
                mb="$2"
                mt={-3}
                size="xs"
                color={theme.colors.textSecondary}
              >
                Selected: {settings.themeLight}
              </Text>
            </Cell>
          )}
          {settings.themeMatchSystem && (
            <Cell
              cellStyle="Basic"
              title={t("settings.appearance.themes.systemDark")}
              accessory="DisclosureIndicator"
              onPress={() =>
                navigation.push("ThemeSelection", { themeProp: "themeDark" })
              }
              backgroundColor={theme.colors.fg}
              titleTextColor={theme.colors.textPrimary}
              rightDetailColor={theme.colors.textSecondary}
            >
              <Text
                ml="$4"
                mb="$2"
                mt={-3}
                size="xs"
                color={theme.colors.textSecondary}
              >
                Selected: {settings.themeDark}
              </Text>
            </Cell>
          )}

          <Cell
            cellStyle="RightDetail"
            title={
              <Text>
                {`${t("Accent Color")}  `}
                <Badge variant="solid" action="info" size="sm">
                  <Badge.Text>Alpha</Badge.Text>
                </Badge>
              </Text>
            }
            cellAccessoryView={
              <Input
                style={{ minWidth: "40%" }}
                value={accent}
                onChange={(e) => setAccent(e.nativeEvent.text)}
                onEndEditing={() => {
                  let hexToCheck = accent;

                  if (hexToCheck && !hexToCheck.includes("#")) {
                    hexToCheck = `#${hexToCheck}`;
                  }

                  if (accent === "") {
                    showToast({
                      message: "Accent color cleared",
                      duration: 3000,
                      variant: "info",
                    });
                    setAccent("");
                    setSetting("accentColor", "");
                    return;
                  }

                  if (hexPattern.test(hexToCheck ?? "")) {
                    if (hexToCheck !== settings.accentColor) {
                      showToast({
                        message: t("toast.accentColorUpdated"),
                        duration: 3000,
                        variant: "info",
                      });
                    }
                    setSetting("accentColor", hexToCheck ?? "");
                  } else {
                    setAccent("");
                    setSetting("accentColor", "");
                    showToast({
                      message: t("toast.accentColorInvalidHexCode"),
                      duration: 3000,
                      variant: "error",
                    });
                  }
                }}
                placeholder={t(
                  "settings.appearance.themes.hexCode.placeholder"
                )}
                autoCapitalize="none"
                autoCorrect={false}
              />
            }
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
          />
        </Section>

        <Section header={t("settings.appearance.font.header")}>
          <Cell
            title={t("settings.appearance.font.useSystemFont")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.isSystemFont}
                onValueChange={(v) => onChange("isSystemFont", v)}
              />
            }
          />
          <Cell
            title={t("settings.appearance.font.useSystemFontSize")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.isSystemTextSize}
                onValueChange={(v) => onChange("isSystemTextSize", v)}
              />
            }
          />
          <Cell
            isDisabled={settings.isSystemTextSize}
            title={
              <Text>
                {`${t("settings.appearance.font.textSize")}  `}
                <Badge variant="solid" action="info" size="sm">
                  <Badge.Text>Alpha</Badge.Text>
                </Badge>
              </Text>
            }
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
          >
            <HStack width="100%" alignItems="center" px="$6">
              <Text size="sm">A</Text>
              <Box flex={1}>
                <Slider
                  disabled={settings.isSystemTextSize}
                  style={{ height: 40, marginHorizontal: 20, marginBottom: 5 }}
                  minimumValue={1}
                  maximumValue={7}
                  thumbTintColor={theme.colors.textPrimary}
                  minimumTrackTintColor={theme.colors.textPrimary}
                  maximumTrackTintColor={theme.colors.textPrimary}
                  step={1}
                  value={settings.fontSize}
                  onSlidingComplete={(v) => onChange("fontSize", v)}
                />
              </Box>
              <Text size="xl">A</Text>
            </HStack>
          </Cell>
          <AppContextMenuButton
            options={fontWeightOptions}
            selection={selectedFontWeight}
            onPressMenuItem={({ nativeEvent }) => {
              setSetting(
                "fontWeightPostTitle",
                FontWeightMap[nativeEvent.actionKey] || 400
              );
            }}
          >
            <Cell
              cellStyle="RightDetail"
              title={t("settings.appearance.font.postTitleFontWeight")}
              detail={selectedFontWeight}
              backgroundColor={theme.colors.fg}
              titleTextColor={theme.colors.textPrimary}
              rightDetailColor={theme.colors.textSecondary}
              accessory="DisclosureIndicator"
            />
          </AppContextMenuButton>
        </Section>
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
