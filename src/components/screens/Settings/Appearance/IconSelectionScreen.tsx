import { TableView } from "@gkasdorf/react-native-tableview-simple";
import { Image, ScrollView, useTheme } from "native-base";
import { HStack, Text } from "@components/common/Gluestack";
import React from "react";
import { StyleSheet } from "react-native";
import { changeIcon } from "react-native-change-icon";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { setSetting } from "../../../../slices/settings/settingsActions";
import { selectSettings } from "../../../../slices/settings/settingsSlice";
import { appIconOptions } from "../../../../types/AppIconType";
import CCell from "../../../common/Table/CCell";
import CSection from "../../../common/Table/CSection";
import SFIcon from "../../../common/icons/SFIcon";

function IconSelectionScreen() {
  const settings = useAppSelector(selectSettings);

  const dispatch = useAppDispatch();
  const theme = useTheme();

  return (
    <ScrollView backgroundColor={theme.colors.app.bg} flex={1}>
      <TableView style={styles.table}>
        <CSection footer="App icons by dizzy@lemmy.ml">
          {Object.entries(appIconOptions).map(([key, value]) => (
            <CCell
              key={key}
              cellStyle="RightDetail"
              title={
                <HStack space="2.5" alignItems="center">
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
              backgroundColor={theme.colors.app.fg}
              titleTextColor={theme.colors.app.textPrimary}
              rightDetailColor={theme.colors.app.textSecondary}
              onPress={() => {
                dispatch(setSetting({ appIcon: key }));
                changeIcon(key);
              }}
            />
          ))}
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

export default IconSelectionScreen;
