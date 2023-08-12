import {
  Cell,
  Section,
  TableView,
} from "@gkasdorf/react-native-tableview-simple";
import { Box, HStack, ScrollView, Text, View } from "@src/components/gluestack";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import {
  useSettingsStore,
  useThemeOptions,
} from "@src/state/settings/settingsStore";
import {
  DarkThemeOptionsArr,
  LightThemeOptionsArr,
  ThemeOptionsMap,
} from "@src/theme/themeOptions";
import { SFIcon } from "@src/components/common/icons/SFIcon";
import { setSetting } from "@src/state/settings/actions";

function ThemeColors({ accent, bg }: { accent: string; bg: string }) {
  return (
    <Box borderRadius="$md" overflow="hidden">
      <Box
        style={{
          width: 25,
          height: 25,
          backgroundColor: bg,
        }}
      >
        <Box
          style={{
            width: 0,
            height: 0,
            borderTopColor: accent,
            borderTopWidth: 25,
            borderRightWidth: 25,
            borderRightColor: "transparent",
          }}
        />
      </Box>
    </Box>
  );
}

interface IProps {
  route: any;
}

function ThemeSelectionScreen({ route }: IProps): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useThemeOptions();
  const themeProp = route.params?.themeProp || "theme";

  const settings = useSettingsStore();
  const currentTheme = settings.theme;

  return (
    <View backgroundColor={theme.colors.bg} flex={1}>
      <ScrollView bg={theme.colors.bg} flex={1}>
        <TableView style={styles.table}>
          <Section header={t("settings.appearance.themes.light")}>
            {LightThemeOptionsArr.map((themeName) => (
              <Cell
                key={themeName}
                cellStyle="RightDetail"
                backgroundColor={theme.colors.fg}
                titleTextColor={theme.colors.textPrimary}
                rightDetailColor={theme.colors.textSecondary}
                title={
                  <HStack space="sm">
                    <ThemeColors
                      accent={ThemeOptionsMap[themeName].colors.accent}
                      bg={ThemeOptionsMap[themeName].colors.bg}
                    />
                    <Text>{themeName}</Text>
                  </HStack>
                }
                cellAccessoryView={
                  currentTheme === themeName && (
                    <SFIcon icon="checkmark" size={12} />
                  )
                }
                onPress={() => {
                  const themeSetting = {};
                  themeSetting[themeProp] = themeName;
                  setSetting("themeSetting", themeSetting);
                }}
              />
            ))}
          </Section>
          <Section header={t("settings.appearance.themes.dark")}>
            {DarkThemeOptionsArr.map((themeName) => (
              <Cell
                key={themeName}
                cellStyle="RightDetail"
                backgroundColor={theme.colors.fg}
                titleTextColor={theme.colors.textPrimary}
                rightDetailColor={theme.colors.textSecondary}
                title={
                  <HStack space="sm">
                    <ThemeColors
                      accent={ThemeOptionsMap[themeName].colors.accent}
                      bg={ThemeOptionsMap[themeName].colors.bg}
                    />
                    <Text>{themeName}</Text>
                  </HStack>
                }
                cellAccessoryView={
                  currentTheme === themeName && (
                    <SFIcon icon="checkmark" size={12} />
                  )
                }
                onPress={() => {
                  const themeSetting = {};
                  themeSetting[themeProp] = themeName;
                  setSetting("themeSetting", themeSetting);
                }}
              >
                {themeName === "Sunset" ? (
                  <Text
                    ml="$4"
                    mb="$2"
                    mt={-3}
                    size="xs"
                    color={theme.colors.textSecondary}
                  >
                    Inspired by the Sunset Theme from Apollo (Christian Selig)
                  </Text>
                ) : null}
              </Cell>
            ))}
          </Section>
        </TableView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    marginHorizontal: 15,
  },
});

export default ThemeSelectionScreen;
