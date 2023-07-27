import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView } from "@src/components/common/Gluestack";
import { Alert, Button, StyleSheet } from "react-native";
import { TableView } from "@gkasdorf/react-native-tableview-simple";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import {
  FilterStoreType,
  useFiltersStore,
  useFilterStoreType,
} from "@src/stores/filters/filtersStore";
import { getBaseUrl } from "@src/helpers/LinkHelper";
import { FilterItem } from "@src/components/screens/Settings/Filters/FilterItem";
import { ParamListBase } from "@react-navigation/native";
import CSection from "../../../common/Table/CSection";
import CCell from "../../../common/Table/CCell";

interface FilterScreenProps<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string,
  NavigatorID extends string | undefined = undefined
> {
  type: FilterStoreType;
  navigation: NativeStackNavigationProp<ParamList, RouteName, NavigatorID>;
}

export function FilterScreen<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string,
  NavigatorID extends string | undefined = undefined
>({ type, navigation }: FilterScreenProps<ParamList, RouteName, NavigatorID>) {
  const { t } = useTranslation();
  const theme = useThemeOptions();

  const filtersStore = useFiltersStore();
  const filters = useFilterStoreType(type);

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <Button
          title={t("Add")}
          onPress={onAddPress}
          color={theme.colors.accent}
        />
      ),
    });
  }, []);

  const onAddPress = () => {
    Alert.prompt(
      t(`settings.filters.add.${type}`),
      t(`settings.filters.enter.${type}`),
      [
        {
          text: t("Cancel"),
          style: "cancel",
        },
        {
          text: t("Save"),
          style: "default",
          onPress: (value?: string) => {
            if (!value) return;
            switch (type) {
              case "keyword":
                filtersStore.addKeyword(value.toLowerCase()).then();
                break;
              case "instance":
                filtersStore.addInstance(getBaseUrl(value)).then();
                break;
              default:
                throw new Error(`Unknown filter store type${type}`);
            }
          },
        },
      ]
    );
  };

  const items = useMemo(
    () =>
      filters.map((name) => <FilterItem key={name} type={type} name={name} />),
    [filters, type]
  );

  return (
    <ScrollView bg={theme.colors.bg} flex={1}>
      <TableView style={styles.table}>
        <CSection header={t(`settings.filters.header.${type}`)}>
          {filters.length < 1 ? (
            <CCell
              cellStyle="RightDetail"
              title={t(`settings.filters.no.${type}`)}
              backgroundColor={theme.colors.fg}
              titleTextColor={theme.colors.textPrimary}
              rightDetailColor={theme.colors.textSecondary}
            />
          ) : (
            items
          )}
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
