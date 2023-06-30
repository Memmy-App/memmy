import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView, useTheme } from "native-base";
import CTable from "../../ui/table/CTable";
import CSection from "../../ui/table/CSection";
import useTraverse from "../../hooks/traverse/useTraverse";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import { getCommunityFullName } from "../../../lemmy/LemmyHelpers";
import CCell from "../../ui/table/CCell";
import LoadingView from "../../ui/Loading/LoadingView";

function TraverseScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const theme = useTheme();
  const traverse = useTraverse();

  if (traverse.loading) {
    return <LoadingView />;
  }

  return (
    <ScrollView flex={1} backgroundColor={theme.colors.app.bg}>
      <CTable>
        <CSection header="SUBSCRIPTIONS">
          {traverse.subscriptions?.map((c) => (
            <CCell
              key={c.community.id}
              title={`${c.community.name}@${getBaseUrl(c.community.actor_id)}`}
              accessory="DisclosureIndicator"
              onPress={() => {
                navigation.navigate("Community", {
                  communityId: c.community.id,
                  communityName: c.community.name,
                  communityFullName: getCommunityFullName(c),
                  actorId: c.community.actor_id,
                });
              }}
            />
          ))}
        </CSection>
      </CTable>
    </ScrollView>
  );
}

export default TraverseScreen;
