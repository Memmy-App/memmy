import { ScrollView, Text, useTheme } from "native-base";
import React from "react";
import { Alert, StyleSheet } from "react-native";
import { Section, TableView } from "@gkasdorf/react-native-tableview-simple";
import { IconCheck } from "tabler-icons-react-native";
import { setSetting } from "../../../../slices/settings/settingsActions";
import { selectSettings } from "../../../../slices/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { ThemeOptionsArr } from "../../../../theme/themeOptions";
import CCell from "../../../ui/table/CCell";

function ThemeSelectionScreen({ route }) {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const themeProp = route.params?.themeProp || 'theme';

  const settings = useAppSelector(selectSettings);
  const currentTheme = settings[themeProp];

  return (
    <ScrollView backgroundColor={theme.colors.app.bg} flex={1}>
      <TableView style={styles.table}>
        <Section header="App Theme" roundedCorners hideSurroundingSeparators>
          {ThemeOptionsArr.map((themeName) => (
            <CCell
              cellStyle="RightDetail"
              title={themeName}
              cellAccessoryView={
                currentTheme === themeName && (
                  <IconCheck color={theme.colors.app.accent} />
                )
              }
              backgroundColor={theme.colors.app.fg}
              titleTextColor={theme.colors.app.textPrimary}
              rightDetailColor={theme.colors.app.textSecondary}
              onPress={() => {
                const themeSetting = {};
                themeSetting[themeProp] = themeName;
                dispatch(setSetting(themeSetting));
              }}
            >
              {themeName === "Sunset" ? (
                <Text
                  ml={4}
                  mb={2}
                  mt={-4}
                  fontSize="xs"
                  color={theme.colors.app.textSecondary}
                >
                  Credit to Christian Selig for this one
                </Text>
              ) : null}
            </CCell>
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
