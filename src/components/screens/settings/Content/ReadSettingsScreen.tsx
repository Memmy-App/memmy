import React from "react";
import { useTheme, VStack } from "native-base";
import { Switch } from "react-native";
import CTable from "../../../ui/table/CTable";
import CSection from "../../../ui/table/CSection";
import CCell from "../../../ui/table/CCell";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { selectSettings } from "../../../../slices/settings/settingsSlice";
import { setSetting } from "../../../../slices/settings/settingsActions";

function ReadSettingsScreen() {
  const theme = useTheme();

  const settings = useAppSelector(selectSettings);

  const dispatch = useAppDispatch();

  const onChange = (key: string, value: any) => {
    dispatch(setSetting({ [key]: value }));
  };

  return (
    <VStack backgroundColor={theme.colors.app.bg}>
      <CTable>
        <CSection header="MARK READ SETTINGS">
          <CCell
            cellStyle="RightDetail"
            title="Mark Read on Post Open"
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.markReadOnPostView}
                onValueChange={(v) => onChange("markReadOnPostView", v)}
              />
            }
          />
          <CCell
            cellStyle="RightDetail"
            title="Mark Read on Image View"
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.markReadOnPostImageView}
                onValueChange={(v) => onChange("markReadOnPostImageView", v)}
              />
            }
          />
          <CCell
            cellStyle="RightDetail"
            title="Mark Read on Vote"
            backgroundColor={theme.colors.app.fg}
            titleTextColor={theme.colors.app.textPrimary}
            rightDetailColor={theme.colors.app.textSecondary}
            cellAccessoryView={
              <Switch
                value={settings.markReadOnPostVote}
                onValueChange={(v) => onChange("markReadOnPostVote", v)}
              />
            }
          />
        </CSection>
      </CTable>
    </VStack>
  );
}

export default ReadSettingsScreen;
