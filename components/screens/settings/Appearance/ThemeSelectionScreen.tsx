import React from "react";
import { Alert, LayoutAnimation, StyleSheet, Switch } from "react-native";
import { getBuildNumber, getVersion } from "react-native-device-info";
import { useActionSheet } from "@expo/react-native-action-sheet";
import Slider from "@react-native-community/slider";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Badge, Box, HStack, ScrollView, Text, useTheme } from "native-base";
import { Section, TableView } from "react-native-tableview-simple";
import { IconCheck } from "tabler-icons-react-native";
import { deleteLog, sendLog } from "../../../../helpers/LogHelper";
import { selectAccounts } from "../../../../slices/accounts/accountsSlice";
import { setSetting } from "../../../../slices/settings/settingsActions";
import { selectSettings } from "../../../../slices/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { ThemeOptionsArr } from "../../../../theme/themeOptions";
import CCell from "../../../ui/table/CCell";
import CSection from "../../../ui/table/CSection";
import { HapticOptionsArr } from "../../../../types/haptics/hapticOptions";

function ThemeSelectionScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const accounts = useAppSelector(selectAccounts);

  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { showActionSheetWithOptions } = useActionSheet();

  const {
    theme: currentTheme,
    fontSize,
    isSystemTextSize,
  } = useAppSelector(selectSettings);

  const onChange = (key: string, value: any) => {
    dispatch(setSetting({ [key]: value }));
  };

  return (
    <ScrollView backgroundColor={theme.colors.app.bg} flex={1}>
      <TableView style={styles.table}>
        <Section header="App Theme" roundedCorners hideSurroundingSeparators>
          {ThemeOptionsArr.map((themeName) => (
            <CCell
              cellStyle="RightDetail"
              title={themeName}
              subti
              cellAccessoryView={
                currentTheme === themeName && (
                  <IconCheck color={theme.colors.app.accent} />
                )
              }
              backgroundColor={theme.colors.app.fg}
              titleTextColor={theme.colors.app.textPrimary}
              rightDetailColor={theme.colors.app.textSecondary}
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

export default ThemeSelectionScreen;
