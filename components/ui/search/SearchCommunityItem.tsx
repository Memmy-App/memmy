import React from "react";
import { CommunityView } from "lemmy-js-client";
import { useTheme } from "native-base";
import FastImage from "react-native-fast-image";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MCell from "../table/MCell";
import { getCommunityFullName } from "../../../lemmy/LemmyHelpers";

interface IProps {
  community: CommunityView;
}

function SearchCommunityItem({ community }: IProps) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

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
      title={community.community.name}
      icon={
        <FastImage
          source={{ uri: community.community.icon }}
          style={{ height: 24, width: 24, borderRadius: 100 }}
        />
      }
      showChevron
      onPress={onPress}
    />
  );
}

export default React.memo(SearchCommunityItem);
