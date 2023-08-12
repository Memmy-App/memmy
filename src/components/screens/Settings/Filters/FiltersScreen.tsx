import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text } from "@src/components/gluestack";
import { StyleSheet } from "react-native";
import {
  Cell,
  Section,
  TableView,
} from "@gkasdorf/react-native-tableview-simple";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useThemeOptions } from "@src/state/settings/settingsStore";

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

function FiltersScreen({ navigation }: IProps): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useThemeOptions();

  return (
    <ScrollView bg={theme.colors.bg} flex={1}>
      <TableView style={styles.table}>
        <Text color="$textSecondary" sx={{ mt: "$5" }}>
          {t("settings.filters.description")}
        </Text>
        <Section>
          <Cell
            cellStyle="RightDetail"
            title={t("Keywords")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            accessory="DisclosureIndicator"
            onPress={() => navigation.push("KeywordFilters")}
          />
          <Cell
            cellStyle="RightDetail"
            title={t("Instances")}
            backgroundColor={theme.colors.fg}
            titleTextColor={theme.colors.textPrimary}
            rightDetailColor={theme.colors.textSecondary}
            accessory="DisclosureIndicator"
            onPress={() => navigation.push("InstanceFilters")}
          />
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

export default FiltersScreen;
