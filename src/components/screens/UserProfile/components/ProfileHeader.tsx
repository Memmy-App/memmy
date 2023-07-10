import React from "react";
import { Box, HStack, Text, useTheme, View, VStack } from "native-base";
import FastImage from "react-native-fast-image";
import {
  IconCake,
  IconCalendarStar,
  IconCircleArrowUp,
  IconMessage2,
  IconNotes,
  IconUser,
} from "tabler-icons-react-native";
import { StyleSheet } from "react-native";
import dayjs from "dayjs";
import { getBaseUrl } from "../../../../helpers/LinkHelper";
import { UseProfile } from "../../../../hooks/profile/useProfile";
import { getCakeDay } from "../../../../helpers/TimeHelper";

interface IProps {
  profile: UseProfile;
}

function ProfileHeader({ profile }: IProps) {
  const theme = useTheme();

  if (!profile.profile) return null;

  return (
    <VStack flex={1} backgroundColor={theme.colors.app.bg}>
      <View style={styles.bannerContainer}>
        <HStack
          alignItems="flex-end"
          position="absolute"
          height="100%"
          width="100%"
          zIndex={1}
          px={2}
          py={3.5}
          space={4}
        >
          {profile.profile.person.avatar ? (
            <FastImage
              source={{
                uri: profile.profile.person.avatar,
              }}
              style={styles.avatar}
            />
          ) : (
            <IconUser color={theme.colors.app.textSecondary} size={64} />
          )}
          <VStack>
            <Text fontWeight="semibold" fontSize="2xl">
              {profile.profile.person.name}
            </Text>
            <Text fontSize="lg">
              @{getBaseUrl(profile.profile.person.actor_id)}
            </Text>
          </VStack>
        </HStack>
        {profile.profile.person.banner ? (
          <FastImage
            resizeMode="cover"
            style={styles.banner}
            source={{
              uri: profile.profile.person.banner,
            }}
          />
        ) : (
          <Box style={styles.noBanner} />
        )}
      </View>
      <VStack py={3.5} px={5}>
        <HStack space={7}>
          <HStack alignItems="center" space={1}>
            <IconNotes size={26} color={theme.colors.app.accent} />
            <Text fontSize="md">{profile.profile.counts.post_count}</Text>
            <IconCircleArrowUp size={26} color={theme.colors.app.accent} />
            <Text fontSize="md">{profile.profile.counts.post_score}</Text>
          </HStack>
          <HStack alignItems="center" space={1}>
            <IconMessage2 size={26} color={theme.colors.app.accent} />
            <Text fontSize="md">{profile.profile.counts.comment_count}</Text>
            <IconCircleArrowUp size={26} color={theme.colors.app.accent} />
            <Text fontSize="md">{profile.profile.counts.comment_score}</Text>
          </HStack>
        </HStack>
        <HStack space={7} mt={3} alignItems="center">
          <HStack alignItems="center" space={1}>
            <IconCalendarStar size={26} color={theme.colors.app.accent} />
            <Text fontSize="md">
              {dayjs(profile.profile.person.published).utc(true).fromNow()}
            </Text>
          </HStack>
          <HStack alignItems="center" space={1}>
            <IconCake size={26} color={theme.colors.app.accent} />
            <Text fontSize="md">
              {getCakeDay(profile.profile.person.published)}
            </Text>
          </HStack>
        </HStack>
      </VStack>
    </VStack>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: 165,
    width: "100%",
    opacity: 0.2,
  },

  noBanner: {
    height: 100,
    width: "100%",
  },

  bannerContainer: {
    flex: 1,
    bottom: 0,
    overflow: "hidden",
  },

  avatar: {
    height: 64,
    width: 64,
    borderRadius: 100,
  },
});

export default React.memo(ProfileHeader);
