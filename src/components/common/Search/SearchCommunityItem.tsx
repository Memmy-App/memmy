import FastImage from "@gkasdorf/react-native-fast-image";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CommunityView } from "lemmy-js-client";
import { useTheme } from "native-base";
import React from "react";
import { getCommunityFullName } from "../../../helpers/LemmyHelpers";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import { shortenNumber } from "../../../helpers/NumberHelper";
import MCell from "../Table/MCell";
import { PlanetIcon } from "../icons/PlanetIcon";

interface IProps {
  community: CommunityView;
}

function SearchCommunityItem({ community }: IProps) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const theme = useTheme();

  const onPress = () => {
    navigation.navigate("Community", {
      communityId: community.community.id,
      communityName: community.community.name,
      communityFullName: getCommunityFullName(community),
      actorId: community.community.actor_id,
    });
  };

  return (
    <MCell
      title={`${community.community.name}@${getBaseUrl(
        community.community.actor_id
      )}`}
      subtitle={
        community.counts.subscribers
          ? `${shortenNumber(Number(community.counts.subscribers))} subscribers`
          : "0 subscribers"
      }
      icon={
        community.community.icon ? (
          <FastImage
            source={{ uri: community.community.icon }}
            style={{ height: 24, width: 24, borderRadius: 100 }}
          />
        ) : (
          <PlanetIcon />
        )
      }
      showChevron
      onPress={onPress}
    />
  );
}

export default React.memo(SearchCommunityItem);
