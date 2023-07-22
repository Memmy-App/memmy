import FastImage from "@gkasdorf/react-native-fast-image";
import dayjs from "dayjs";
import { Spacer, useTheme, View } from "native-base";
import { Box, HStack, Text, VStack } from "@components/common/Gluestack";
import React from "react";
import { StyleSheet } from "react-native";
import { ICON_MAP } from "../../../../constants/IconMap";
import { getBaseUrl } from "../../../../helpers/LinkHelper";
import { getCakeDay } from "../../../../helpers/TimeHelper";
import { UseProfile } from "../../../../hooks/profile/useProfile";
import SFIcon from "../../../common/icons/SFIcon";

interface IProps {
  profile: UseProfile;
}

function ProfileHeader({ profile }: IProps) {
  const theme = useTheme();

  if (!profile.profile) return null;

  return (
    <VStack flex={1} backgroundColor={theme.colors.app.bg} space="lg">
      <View
        backgroundColor={theme.colors.app.fg}
        mx={4}
        mt={2}
        px={3}
        borderRadius={10}
      >
        <HStack
          alignItems="center"
          position="absolute"
          height="100%"
          width="100%"
          zIndex={1}
          px="$5"
          py="$3.5"
          space="lg"
        >
          {profile.profile.person.avatar ? (
            <FastImage
              source={{
                uri: profile.profile.person.avatar,
              }}
              style={styles.avatar}
            />
          ) : (
            <SFIcon icon={ICON_MAP.USER_AVATAR} size={48} boxSize={64} />
          )}
          <VStack>
            <Text fontWeight="semibold" fontSize="$2xl">
              {profile.profile.person.name}
            </Text>
            <Text fontSize="$lg">
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
      <VStack
        py="$3"
        mx="$4"
        px="$3"
        backgroundColor={theme.colors.app.fg}
        borderRadius={10}
      >
        <HStack space="3xl">
          <VStack alignItems="flex-start" space="xs">
            <Text fontSize="$sm" color={theme.colors.app.textSecondary}>
              Posts
            </Text>
            <HStack alignItems="center" space="xs">
              <SFIcon icon="doc.plaintext" size={14} />
              <Text fontSize="$md">{profile.profile.counts.post_count}</Text>
              <SFIcon icon="arrow.up.circle" size={14} />
              <Text fontSize="$md">{profile.profile.counts.post_score}</Text>
            </HStack>
          </VStack>
          <VStack alignItems="flex-start" space="xs">
            <Text fontSize="$sm" color={theme.colors.app.textSecondary}>
              Comments
            </Text>
            <HStack alignItems="center" space="xs">
              <SFIcon icon={ICON_MAP.REPLY} size={12} />
              <Text fontSize="$md">{profile.profile.counts.comment_count}</Text>
              <SFIcon icon="arrow.up.circle" size={14} />
              <Text fontSize="$md">{profile.profile.counts.comment_score}</Text>
            </HStack>
          </VStack>
        </HStack>
        <HStack space="3xl" mt="$1" alignItems="center">
          <VStack alignItems="flex-start" space="xs">
            <Text fontSize="$sm" color={theme.colors.app.textSecondary}>
              Account Created
            </Text>
            <HStack alignItems="center" space="xs">
              <SFIcon icon="birthday.cake" size={12} />
              <Text fontSize="$md">
                {getCakeDay(profile.profile.person.published)}
              </Text>
            </HStack>
          </VStack>
          <VStack alignItems="flex-start" space="xs">
            <Spacer />
            <HStack alignItems="center" space="xs">
              <SFIcon icon="person.crop.circle.badge.checkmark" size={14} />
              <Text fontSize="$md">
                {dayjs(profile.profile.person.published).utc(true).fromNow()}
              </Text>
            </HStack>
          </VStack>
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

  avatar: {
    height: 64,
    width: 64,
    borderRadius: 100,
  },
});

export default React.memo(ProfileHeader);
