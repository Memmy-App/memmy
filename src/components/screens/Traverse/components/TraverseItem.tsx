import React, { useCallback } from "react";
import { CommunityView } from "lemmy-js-client";
import { HStack, Pressable, Text, useTheme, VStack } from "native-base";
import FastImage from "@gkasdorf/react-native-fast-image";
import { StyleSheet } from "react-native";
import {
  IconChevronRight,
  IconEye,
  IconNotes,
  IconPlanet,
  IconStar,
  IconStarFilled,
} from "tabler-icons-react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getCommunityFullName } from "../../../../helpers/LemmyHelpers";
import { toggleFavorite } from "../../../../slices/favorites/favoritesActions";

import { useAppDispatch, useAppSelector } from "../../../../../store";

import { selectCurrentAccount } from "../../../../slices/accounts/accountsSlice";
import { onGenericHapticFeedback } from "../../../../helpers/HapticFeedbackHelpers";
import { getBaseUrl } from "../../../../helpers/LinkHelper";

interface IProps {
  community: CommunityView;
  isFavorite: boolean;
}

function TraverseItem({ community, isFavorite }: IProps) {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const onPress = useCallback(() => {
    navigation.navigate("Community", {
      communityId: community.community.id,
      communityName: community.community.name,
      communityFullName: getCommunityFullName(community),
      actorId: community.community.actor_id,
    });
    navigation.dispatch(DrawerActions.closeDrawer());
  }, [community.community.id]);

  const dispatch = useAppDispatch();
  const onChange = useCallback(
    (key: string, value: any) => {
      dispatch(
        toggleFavorite([
          `${currentAccount.username}@${currentAccount.instance}`,
          key,
          value,
        ])
      );
    },
    [community.community.id]
  );

  const currentAccount = useAppSelector(selectCurrentAccount);

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
            <VStack>
              <Text>{community.community.name}</Text>
              <Text
                fontSize="2xs"
                color={theme.colors.app.textSecondary}
                fontStyle="italic"
              >
                {getBaseUrl(community.community.actor_id)}
              </Text>
            </VStack>
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
        <HStack ml="auto" alignItems="center">
          <Pressable
            onPress={() => {
              onGenericHapticFeedback();
              const communityFullName = getCommunityFullName(community);
              onChange(communityFullName, !isFavorite);
            }}
            pr={2}
          >
            {isFavorite ? (
              <IconStarFilled
                size={24}
                color=""
                style={{ color: theme.colors.app.accent }}
              />
            ) : (
              <IconStar size={24} color={theme.colors.app.accent} />
            )}
          </Pressable>
          <IconChevronRight size={24} color={theme.colors.app.accent} />
        </HStack>
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

// export default TraverseItem;
export default React.memo(TraverseItem);
