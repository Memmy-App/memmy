import React from "react";
import {
  Box,
  HStack,
  ScrollView,
  Text,
  useTheme,
  View,
  VStack,
} from "native-base";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import FastImage from "react-native-fast-image";
import { RefreshControl, StyleSheet } from "react-native";
import {
  IconBook,
  IconCake,
  IconCalendarStar,
  IconHandStop,
  IconMessage2,
  IconMessageChatbot,
  IconNotes,
  IconUser,
} from "tabler-icons-react-native";
import moment from "moment";
import useProfile from "../../hooks/profile/useProfile";
import LoadingView from "../../ui/Loading/LoadingView";
import LoadingErrorView from "../../ui/Loading/LoadingErrorView";
import { getBaseUrl } from "../../../helpers/LinkHelper";
import { getCakeDay } from "../../../helpers/TimeHelper";
import ButtonOne from "../../ui/buttons/ButtonOne";

function BookmarksScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}) {
  const profile = useProfile(
    route.params && route.params.fullUsername
      ? route.params.fullUsername
      : undefined
  );
  const theme = useTheme();

  const refreshControl = (
    <RefreshControl refreshing={profile.loading} onRefresh={profile.doLoad} />
  );

  if (profile.loading || !profile.profile) {
    return <LoadingView />;
  }

  if (profile.error) {
    return <LoadingErrorView onRetryPress={profile.doLoad} />;
  }

  return (
    <ScrollView
      refreshControl={refreshControl}
      backgroundColor={theme.colors.app.backgroundSecondary}
    >
      <VStack flex={1} backgroundColor={theme.colors.app.backgroundSecondary}>
        <VStack>
          <View style={styles.bannerContainer}>
            {/* <VStack alignItems="flex-start"> */}
            <HStack
              alignItems="flex-end"
              position="absolute"
              height="100%"
              width="100%"
              zIndex={1}
              px={2}
              py={3.5}
            >
              {profile.profile.person.avatar ? (
                <FastImage
                  source={{
                    uri: profile.profile.person.avatar,
                  }}
                  style={styles.avatar}
                />
              ) : (
                <IconUser color={theme.colors.app.iconColor} size={64} />
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
            {/* </VStack> */}
            {profile.profile.person.banner ? (
              <FastImage
                resizeMode="cover"
                style={styles.banner}
                source={{
                  uri: profile.profile.person.banner,
                }}
              />
            ) : (
              <Box style={styles.banner} />
            )}
          </View>
          <VStack py={3.5} px={5}>
            <HStack space={3}>
              <HStack alignItems="center" space={1}>
                <IconNotes size={26} color={theme.colors.app.iconColor2} />
                <Text fontSize="md">{profile.profile.counts.post_count}</Text>
              </HStack>
              <HStack alignItems="center" space={1}>
                <IconMessage2 size={26} color={theme.colors.app.iconColor2} />
                <Text fontSize="md">
                  {profile.profile.counts.comment_count}
                </Text>
              </HStack>
            </HStack>
            <HStack space={3} mt={3} alignItems="center">
              <HStack alignItems="center" space={1}>
                <IconCalendarStar
                  size={26}
                  color={theme.colors.app.iconColor2}
                />
                <Text fontSize="md">
                  {moment(profile.profile.person.published).utc(true).fromNow()}
                </Text>
              </HStack>
              <HStack alignItems="center" space={1}>
                <IconCake size={26} color={theme.colors.app.iconColor2} />
                <Text fontSize="md">
                  {getCakeDay(profile.profile.person.published)}
                </Text>
              </HStack>
            </HStack>
            <VStack pt={4}>
              <HStack
                justifyContent="space-between"
                alignItems="center"
                space={3}
              >
                <ButtonOne
                  onPress={() => {}}
                  icon={IconMessageChatbot}
                  text="Message"
                />
                <ButtonOne
                  onPress={() => {
                    navigation.navigate("BlockedCommunities");
                  }}
                  icon={IconHandStop}
                  text="Block"
                />
                <ButtonOne onPress={() => {}} icon={IconBook} text="Bio" />
              </HStack>
            </VStack>
          </VStack>
        </VStack>
        {profile.self && (
          <Text>
            This screen is still a work in progress. If you need to access your
            blocked instances, press "Block". For subscriptions, please press
            the star icon in the feed view.
          </Text>
        )}
      </VStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: 165,
    width: "100%",
    opacity: 0.2,
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

export default BookmarksScreen;
