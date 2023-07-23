import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "native-base";
import { ScrollView } from "@components/common/Gluestack";
import { Alert, Button, StyleSheet } from "react-native";
import { TableView } from "@gkasdorf/react-native-tableview-simple";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CSection from "../../../common/Table/CSection";
import CCell from "../../../common/Table/CCell";
import {
  useFiltersStore,
  useKeywordFilter,
} from "../../../../stores/filters/filtersStore";

interface IProps {
  navigation: NativeStackNavigationProp<any>;
}

function KeywordOption({ keyword }: { keyword: string }) {
  const filtersStore = useFiltersStore();
  const theme = useTheme();
  const { t } = useTranslation();

  const onKeywordPress = () => {
    Alert.alert(
      t("settings.filters.removeKeyword"),
      t("settings.filters.areYouSureKeyword"),
      [
        {
          text: t("Cancel"),
          style: "cancel",
        },
        {
          text: t("Remove"),
          style: "destructive",
          onPress: () => {
            filtersStore.removeKeyword(keyword);
          },
        },
      ]
    );
  };

  return (
    <CCell
      cellStyle="RightDetail"
      title={keyword}
      backgroundColor={theme.colors.app.fg}
      titleTextColor={theme.colors.app.textPrimary}
      rightDetailColor={theme.colors.app.textSecondary}
      accessory="DisclosureIndicator"
      onPress={onKeywordPress}
    />
  );
}

function KeywordsScreen({ navigation }: IProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const filtersStore = useFiltersStore();
  const keywords = useKeywordFilter();

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <Button
          title={t("Add")}
          onPress={onAddPress}
          color={theme.colors.app.accent}
        />
      ),
    });
  }, []);

  const onAddPress = () => {
    Alert.prompt(
      t("settings.filters.addKeyword"),
      t("settings.filters.enterAKeyword"),
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

            filtersStore.addKeyword(value.toLowerCase()).then();
          },
        },
      ]
    );
  };

  const keywordOptions = useMemo(
    () => keywords.map((k) => <KeywordOption key={k} keyword={k} />),
    [keywords]
  );

  return (
    <ScrollView bg={theme.colors.app.bg} flex={1}>
      <TableView style={styles.table}>
        <CSection header={t("Keywords").toUpperCase()}>
          {keywords.length < 1 ? (
            <CCell
              cellStyle="RightDetail"
              title={t("settings.filters.noKeywords")}
              backgroundColor={theme.colors.app.fg}
              titleTextColor={theme.colors.app.textPrimary}
              rightDetailColor={theme.colors.app.textSecondary}
            />
          ) : (
            keywordOptions
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

export default KeywordsScreen;
