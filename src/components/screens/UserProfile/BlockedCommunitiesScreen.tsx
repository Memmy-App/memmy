import React, { useCallback } from "react";
import { ScrollView } from "@src/components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "@root/store";
import { useFocusEffect } from "@react-navigation/native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { trigger } from "react-native-haptic-feedback";
import { useTranslation } from "react-i18next";
import { selectSite } from "../../../slices/site/siteSlice";
import {
  getSiteInfo,
  unblockCommunity,
} from "../../../slices/site/siteActions";
import LoadingView from "../../common/Loading/LoadingView";
import CTable from "../../common/Table/CTable";
import CSection from "../../common/Table/CSection";
import CCell from "../../common/Table/CCell";

function BlockedCommunitiesScreen() {
  // State
  const { communityBlocks, loaded } = useAppSelector(selectSite);

  // Hooks
  const { t } = useTranslation();
  const theme = useAppSelector(selectThemeOptions);
  const dispatch = useAppDispatch();
  const { showActionSheetWithOptions } = useActionSheet();

  useFocusEffect(
    useCallback(() => {
      dispatch(getSiteInfo());
    }, [])
  );

  const onCommunityPress = () => {
    const options = ["Unblock", "Cancel"];
    const cancelButtonIndex = 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        userInterfaceStyle: theme.config.initialColorMode,
      },
      (index: number) => {
        if (index === cancelButtonIndex) return;

        trigger("impactMedium");
        dispatch(unblockCommunity(communityBlocks[index].community.id));
      }
    );
  };

  if (!loaded) {
    return <LoadingView />;
  }

  return (
    <ScrollView flex={1} bg={theme.colors.bg}>
      <CTable>
        <CSection header={t("Blocked Communities")}>
          {communityBlocks.length === 0 ? (
            <CCell cellStyle="Basic" title={t("No blocked communities")} />
          ) : (
            communityBlocks.map((b) => (
              <CCell
                key={b.community.id}
                title={b.community.name}
                accessory="DisclosureIndicator"
                onPress={onCommunityPress}
              />
            ))
          )}
        </CSection>
      </CTable>
    </ScrollView>
  );
}

export default BlockedCommunitiesScreen;
