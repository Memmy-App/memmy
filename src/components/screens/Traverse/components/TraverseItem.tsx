import React, { useCallback } from "react";
import { CommunityView } from "lemmy-js-client";
import { HStack, Pressable, Text, useTheme, VStack } from "native-base";
import FastImage from "@gkasdorf/react-native-fast-image";
import { StyleSheet, View } from "react-native";
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
      <View style={{...styles.hstack, ...styles.container, backgroundColor: theme.colors.app.fg}}>
        <View style={{...styles.vstack, flex: 1, marginVertical: 2}}>
          <View style={{...styles.hstack, ...styles.communityContainer}}>
            {community.community.icon ? (
              <FastImage
                source={{ uri: community.community.icon }}
                style={styles.icon}
              />
            ) : (
              <IconPlanet color={theme.colors.app.textSecondary} size={24} />
            )}
            <View style={styles.vstack}>
              <Text>{community.community.name}</Text>
              <Text
                fontSize="2xs"
                color={theme.colors.app.textSecondary}
                fontStyle="italic"
              >
                {getBaseUrl(community.community.actor_id)}
              </Text>
            </View>
          </View>
          <View style={{...styles.hstack, ...styles.communityDetails}}>
            <View style={{...styles.hstack, ...styles.infoItem}}>
              <IconEye size={12} color={theme.colors.app.textSecondary} />
              <Text
                fontSize="xs"
                color={theme.colors.app.textSecondary}
                fontStyle="italic"
              >
                {community.counts.users_active_day.toLocaleString()} online
              </Text>
            </View>
            <View style={{...styles.hstack, ...styles.infoItem}}>
              <IconNotes size={12} color={theme.colors.app.textSecondary} />
              <Text
                fontSize="xs"
                color={theme.colors.app.textSecondary}
                fontStyle="italic"
              >
                {community.counts.posts.toLocaleString()} posts
              </Text>
            </View>
          </View>
        </View>
        <View style={{...styles.hstack, ...styles.favoriteContainer}}>
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
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  vstack: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  },
  hstack: {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  communityContainer: {
    marginHorizontal: 2,
    alignItems: "center",
    gap: 8,
  },
  communityDetails: {
    marginHorizontal: 2,
    marginTop: 4,
    gap: 6,
  },
  infoItem: {
    marginHorizontal: 2,
    alignItems: "center",
    justifyContent: "space-around",
    gap: 3,
  },
  favoriteContainer: {
    marginHorizontal: "auto",
    alignItems: "center",
  },
  icon: {
    height: 24,
    width: 24,
    borderRadius: 100,
  },
});

// export default TraverseItem;
export default React.memo(TraverseItem);
