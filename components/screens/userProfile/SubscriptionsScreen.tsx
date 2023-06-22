import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView, useTheme } from "native-base";
import { useAppSelector } from "../../../store";
import { selectCommunities } from "../../../slices/communities/communitiesSlice";
import CTable from "../../ui/table/CTable";
import CSection from "../../ui/table/CSection";
import CCell from "../../ui/table/CCell";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import { getCommunityFullName } from "../../../lemmy/LemmyHelpers";

function SubscriptionsScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) {
  const { subscribedCommunities } = useAppSelector(selectCommunities);

  const theme = useTheme();

  return (
    <ScrollView flex={1} backgroundColor={theme.colors.app.backgroundSecondary}>
      <CTable>
        <CSection header="SUBSCRIPTIONS">
          {subscribedCommunities?.map((community) => (
            <CCell
              key={community.community.id}
              title={`${community.community.name}@${getBaseUrl(
                community.community.actor_id
              )}`}
              accessory="DisclosureIndicator"
              onPress={() => {
                navigation.navigate("Community", {
                  communityId: community.community.id,
                  communityName: community.community.name,
                  communityFullName: getCommunityFullName(community),
                  actorId: community.community.actor_id,
                });
              }}
            />
          ))}
        </CSection>
      </CTable>
    </ScrollView>
  );
}

export default SubscriptionsScreen;
