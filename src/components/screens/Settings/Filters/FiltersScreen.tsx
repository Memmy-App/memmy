import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView } from "@src/components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";
import { StyleSheet } from "react-native";
import { TableView } from "@gkasdorf/react-native-tableview-simple";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CSection from "../../../common/Table/CSection";
import CCell from "../../../common/Table/CCell";

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

function FiltersScreen({ navigation }: IProps) {
  const { t } = useTranslation();
  const theme = useAppSelector(selectThemeOptions);

  return (
    <ScrollView bg={theme.colors.bg} flex={1}>
      <TableView style={styles.table}>
        <CSection header={t("Haptics")}>
          <CCell
            cellStyle="RightDetail"
            title={t("Keywords")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            accessory="DisclosureIndicator"
            onPress={() => navigation.push("Keywords")}
          />
          <CCell
            cellStyle="RightDetail"
            title={t("Instances")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            accessory="DisclosureIndicator"
            onPress={() => navigation.push("Instances")}
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

export default FiltersScreen;
