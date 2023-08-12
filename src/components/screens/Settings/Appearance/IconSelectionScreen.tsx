import {
  Cell,
  Section,
  TableView,
} from "@gkasdorf/react-native-tableview-simple";
import { HStack, Image, ScrollView, Text } from "@src/components/gluestack";
import React from "react";
import { StyleSheet } from "react-native";
// @ts-ignore
import { changeIcon } from "react-native-change-icon";
import {
  useSettingsStore,
  useThemeOptions,
} from "@src/state/settings/settingsStore";
import { setSetting } from "@src/state/settings/actions";
import { appIconOptions } from "@src/types/AppIconType";
import SFIcon from "../../../common/icons/SFIcon";

function IconSelectionScreen(): React.JSX.Element {
  const settings = useSettingsStore();

  const theme = useThemeOptions();

  return (
    <ScrollView bg={theme.colors.bg} flex={1}>
      <TableView style={styles.table}>
        <Section footer="App icons by dizzy@lemmy.ml">
          {Object.entries(appIconOptions).map(([key, value]) => (
            <Cell
              key={key}
              cellStyle="RightDetail"
              title={
                <HStack space="mdsm" alignItems="center">
                  <Image
                    style={{ borderRadius: 10, width: 40, height: 40 }}
                    source={value.path}
                    alt={`${value.display} icon`}
                  />
                  <Text>{value.display}</Text>
                </HStack>
              }
              cellAccessoryView={
                settings.appIcon === key && (
                  <SFIcon icon="checkmark" size={12} />
                )
              }
              backgroundColor={theme.colors.fg}
              titleTextColor={theme.colors.textPrimary}
              rightDetailColor={theme.colors.textSecondary}
              onPress={() => {
                setSetting("appIcon", key);
                changeIcon(key);
              }}
            />
          ))}
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

export default IconSelectionScreen;
