import { TableView } from "@gkasdorf/react-native-tableview-simple";
import { ScrollView, Text, useTheme } from "native-base";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { IconCheck } from "tabler-icons-react-native";
import { setSetting } from "../../../../slices/settings/settingsActions";
import { selectSettings } from "../../../../slices/settings/settingsSlice";
import { showToast } from "../../../../slices/toast/toastSlice";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { ThemeOptionsArr } from "../../../../theme/themeOptions";
import CTextInput from "../../../ui/CTextInput";
import Chip from "../../../ui/common/Chip";
import CCell from "../../../ui/table/CCell";
import CSection from "../../../ui/table/CSection";

interface IProps {
  route: any;
}

function ThemeSelectionScreen({ route }: IProps) {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const themeProp = route.params?.themeProp || "theme";

  const settings = useAppSelector(selectSettings);
  const currentTheme = settings[themeProp];

  const [accent, setAccent] = useState(settings.accentColor);
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  return (
    <ScrollView backgroundColor={theme.colors.app.bg} flex={1}>
      <TableView style={styles.table}>
        <CSection header="App Theme" roundedCorners hideSurroundingSeparators>
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
                  Inspired by the Sunset Theme from Apollo (Christian Selig)
                </Text>
              ) : null}
            </CCell>
          ))}
        </CSection>
        <CSection header="Other" roundedCorners hideSurroundingSeparators>
          <CCell
            cellStyle="RightDetail"
            title={
              <Text>
                Accent Color{"  "}
                <Chip text="Alpha" />
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
                  if (hexPattern.test(accent)) {
                    if (accent !== settings.accentColor) {
                      dispatch(
                        showToast({
                          message: "Accent color updated",
                          duration: 3000,
                          variant: "info",
                        })
                      );
                    }
                    dispatch(setSetting({ accentColor: accent }));
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
