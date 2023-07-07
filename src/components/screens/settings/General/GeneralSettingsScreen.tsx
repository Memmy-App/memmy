import { useActionSheet } from "@expo/react-native-action-sheet";
import { TableView } from "@gkasdorf/react-native-tableview-simple";
import { ScrollView, useTheme } from "native-base";
import React from "react";
import { StyleSheet } from "react-native";
import { setSetting } from "../../../../slices/settings/settingsActions";
import { selectSettings } from "../../../../slices/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { HapticOptionsArr } from "../../../../types/haptics/hapticOptions";
import CCell from "../../../ui/table/CCell";
import CSection from "../../../ui/table/CSection";

function GeneralSettingsScreen() {
  const settings = useAppSelector(selectSettings);

  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { showActionSheetWithOptions } = useActionSheet();

  return (
    <ScrollView backgroundColor={theme.colors.app.bg} flex={1}>
      <TableView style={styles.table}>
        <CSection header="HAPTICS">
          <CCell
            cellStyle="RightDetail"
            title="Strength"
            detail={settings.haptics}
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            accessory="DisclosureIndicator"
            onPress={() => {
              const options = [...HapticOptionsArr, "Cancel"];
              const cancelButtonIndex = options.length - 1;

              showActionSheetWithOptions(
                {
                  options,
                  cancelButtonIndex,
                  userInterfaceStyle: theme.config.initialColorMode,
                },
                (index: number) => {
                  if (index === cancelButtonIndex) return;

                  dispatch(setSetting({ haptics: options[index] }));
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

export default GeneralSettingsScreen;
