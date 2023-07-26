import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView } from "@src/components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";
import { Alert, Button, StyleSheet } from "react-native";
import { TableView } from "@gkasdorf/react-native-tableview-simple";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CSection from "../../../common/Table/CSection";
import CCell from "../../../common/Table/CCell";
import {
  useFiltersStore,
  useInstancesFilter,
} from "../../../../stores/filters/filtersStore";
import { getBaseUrl } from "../../../../helpers/LinkHelper";

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

function InstanceOption({ instance }: { instance: string }) {
  const filtersStore = useFiltersStore();
  const theme = useAppSelector(selectThemeOptions);
  const { t } = useTranslation();

  const onInstancePress = () => {
    Alert.alert(
      t("settings.filters.removeInstance"),
      t("settings.filters.areYouSureInstance"),
      [
        {
          text: t("Cancel"),
          style: "cancel",
        },
        {
          text: t("Remove"),
          style: "destructive",
          onPress: () => {
            filtersStore.removeInstance(instance);
          },
        },
      ]
    );
  };

  return (
    <CCell
      cellStyle="RightDetail"
      title={instance}
      backgroundColor={theme.colors.fg}
      titleTextColor={theme.colors.textPrimary}
      rightDetailColor={theme.colors.textSecondary}
      accessory="DisclosureIndicator"
      onPress={onInstancePress}
    />
  );
}

function InstancesScreen({ navigation }: IProps) {
  const { t } = useTranslation();
  const theme = useAppSelector(selectThemeOptions);

  const filtersStore = useFiltersStore();
  const instances = useInstancesFilter();

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
      t("settings.filters.addInstance"),
      t("settings.filters.enterAnInstance"),
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

            filtersStore.addInstance(getBaseUrl(value)).then();
          },
        },
      ]
    );
  };

  const instanceOptions = useMemo(
    () => instances.map((k) => <InstanceOption key={k} instance={k} />),
    [instances]
  );

  return (
    <ScrollView bg={theme.colors.bg} flex={1}>
      <TableView style={styles.table}>
        <CSection header={t("Instances").toUpperCase()}>
          {instances.length < 1 ? (
            <CCell
              cellStyle="RightDetail"
              title={t("settings.filters.noInstances")}
              backgroundColor={theme.colors.fg}
              titleTextColor={theme.colors.textPrimary}
              rightDetailColor={theme.colors.textSecondary}
            />
          ) : (
            instanceOptions
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

export default InstancesScreen;
