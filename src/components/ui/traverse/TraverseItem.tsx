import React from "react";
import { CommunityView } from "lemmy-js-client";
import { HStack, Pressable, Text, useTheme, VStack } from "native-base";
import FastImage from "react-native-fast-image";
import { StyleSheet } from "react-native";
import {
  IconChevronRight,
  IconEye,
  IconNotes,
  IconPlanet,
} from "tabler-icons-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import { getCommunityFullName } from "../../../helpers/LemmyHelpers";

interface IProps {
  community: CommunityView;
}

function TraverseItem({ community }: IProps) {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const onPress = () =>
    navigation.navigate("Community", {
      communityId: community.community.id,
      communityName: community.community.name,
      communityFullName: getCommunityFullName(community),
      actorId: community.community.actor_id,
    });

  return (
    <Pressable onPress={onPress}>
      <HStack
        flex={1}
        backgroundColor={theme.colors.app.fg}
        py={1.5}
        px={2}
        my={1}
        mx={4}
        borderRadius={10}
        alignItems="center"
      >
        <VStack space={1}>
          <HStack space={2} alignItems="center">
            {community.community.icon ? (
              <FastImage
                source={{ uri: community.community.icon }}
                style={styles.icon}
              />
            ) : (
              <IconPlanet color={theme.colors.app.textSecondary} size={24} />
            )}
            <Text>
              {community.community.name}@
              {getBaseUrl(community.community.actor_id)}
            </Text>
          </HStack>
          <HStack space={2}>
            <HStack space={1} alignItems="center">
              <IconEye size={12} color={theme.colors.app.textSecondary} />
              <Text
                fontSize="xs"
                color={theme.colors.app.textSecondary}
                fontStyle="italic"
              >
                {community.counts.users_active_day.toLocaleString()} online
              </Text>
            </HStack>
            <HStack space={1} alignItems="center">
              <IconNotes size={12} color={theme.colors.app.textSecondary} />
              <Text
                fontSize="xs"
                color={theme.colors.app.textSecondary}
                fontStyle="italic"
              >
                {community.counts.posts.toLocaleString()} posts
              </Text>
            </HStack>
          </HStack>
        </VStack>
        <VStack ml="auto" alignItems="center">
          <IconChevronRight size={24} color={theme.colors.app.accent} />
        </VStack>
      </HStack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  icon: {
    height: 24,
    width: 24,
    borderRadius: 100,
  },
});

export default TraverseItem;
