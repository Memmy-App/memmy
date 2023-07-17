import React from "react";
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

interface IProps {
  community: CommunityView;
  isFavorite: boolean;
}

function TraverseItem({ community, isFavorite }: IProps) {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const onPress = () => {
    navigation.navigate("Community", {
      communityId: community.community.id,
      communityName: community.community.name,
      communityFullName: getCommunityFullName(community),
      actorId: community.community.actor_id,
    });
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  const dispatch = useAppDispatch();
  const onChange = (key: string, value: any) => {
    dispatch(
      toggleFavorite([
        `${currentAccount.username}@${currentAccount.instance}`,
        key,
        value,
      ])
    );
  };

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
            <Text>{getCommunityFullName(community)}</Text>
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
          <VStack>
            <Pressable
              onPress={() => {
                onGenericHapticFeedback();
                const communityFullName = getCommunityFullName(community);
                onChange(communityFullName, !isFavorite);
              }}
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
          </VStack>
          <VStack pl={2}>
            <IconChevronRight size={24} color={theme.colors.app.accent} />
          </VStack>
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
