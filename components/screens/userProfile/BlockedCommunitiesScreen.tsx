import React, { useCallback } from "react";
import { ScrollView, useTheme } from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { trigger } from "react-native-haptic-feedback";
import { useAppDispatch, useAppSelector } from "../../../store";
import { selectSite } from "../../../slices/site/siteSlice";
import {
  getSiteInfo,
  unblockCommunity,
} from "../../../slices/site/siteActions";
import LoadingView from "../../ui/Loading/LoadingView";
import CTable from "../../ui/table/CTable";
import CSection from "../../ui/table/CSection";
import CCell from "../../ui/table/CCell";

function BlockedCommunitiesScreen() {
  const { communityBlocks, loaded } = useAppSelector(selectSite);

  const theme = useTheme();

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
    <ScrollView flex={1} backgroundColor={theme.colors.app.backgroundSecondary}>
      <CTable>
        <CSection header="BLOCKED COMMUNITIES">
          {communityBlocks.length === 0 ? (
            <CCell cellStyle="Basic" title="No blocked communities" />
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
