import React, { useEffect, useMemo, useRef } from "react";
import { HStack, Text, VStack } from "@src/components/gluestack";
import FastImage from "@gkasdorf/react-native-fast-image";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useThemeOptions } from "@src/state/settings/settingsStore";
import {
  useCommunity,
  useCommunityStatus,
} from "@src/state/community/communityStore";
import { useRoute } from "@react-navigation/core";
import { setCommunitySubscribed } from "@src/state/community/actions";
import { SFIcon } from "@src/components/common/icons/SFIcon";
import { ICON_MAP } from "@src/types/constants/IconMap";
import { shortenNumber } from "@src/helpers/general";
import { getBaseUrl } from "@src/helpers/links";
import CustomButton from "@src/components/common/Button/CustomButton";

interface IProps {
  communityFullName: string;
}

function CommunityHeader({ communityFullName }: IProps) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { newPost } = useRoute<any>().params;

  const theme = useThemeOptions();
  const { t } = useTranslation();

  const community = useCommunity(communityFullName);
  const communityStatus = useCommunityStatus(communityFullName);

  const creatingPost = useRef<boolean>(false);
  const lastPost = useRef<number>(0);

  const subscriberCount = useMemo(
    () => shortenNumber(community?.counts.subscribers ?? 0),
    [community]
  );

  const baseUrl = useMemo(
    () => getBaseUrl(community?.community.actor_id ?? ""),
    [community]
  );

  useEffect(() => {
    if (
      creatingPost.current &&
      newPost &&
      lastPost.current !== newPost.post.id
    ) {
      creatingPost.current = false;

      const key = Date.now().toString() + newPost.post.id.toString();

      // addPost(key, post);

      setTimeout(() => {
        navigation.push("Post", {
          postKey: key,
        });
      }, 500);
    }
  }, [newPost]);

  const onSubscribePress = () => {
    setCommunitySubscribed(communityFullName).then();
  };

  const onAboutPress = () => {
    navigation.push("CommunityAbout", {
      communityFullName,
    });
  };

  // const onPostPress = () => {
  //   creatingPost.current = true;
  //   lastPost.current = post ? post.post.id : 0;
  //
  //   navigation.push("NewPost", {
  //     communityFullName,
  //   });
  // };

  if (!community || !communityStatus || communityStatus.loading) return null;

  return (
    <VStack pt="$10" pb="$5" px="$5">
      <HStack alignItems="center" space="xl">
        {community.community.icon ? (
          <FastImage
            source={{
              uri: community.community.icon,
            }}
            style={{
              height: 96,
              width: 96,
              borderRadius: 100,
            }}
          />
        ) : (
          <SFIcon icon={ICON_MAP.GLOBE} size={64} />
        )}

        <VStack>
          <HStack space="md" borderColor="red">
            <HStack alignItems="center">
              <SFIcon
                icon={ICON_MAP.PERSON}
                color={theme.colors.textSecondary}
                size={12}
                boxSize={18}
              />
              <Text color={theme.colors.textSecondary}>{subscriberCount}</Text>
            </HStack>
            <HStack space="xs" alignItems="center">
              <SFIcon
                icon={ICON_MAP.SHOW}
                color={theme.colors.textSecondary}
                size={12}
                boxSize={18}
              />
              <Text color={theme.colors.textSecondary}>
                {community.counts.users_active_month}
              </Text>
            </HStack>
          </HStack>
          <Text size="3xl" fontWeight="bold">
            {community.community.name}
          </Text>
          <Text size="md" color={theme.colors.textSecondary} mt={-3}>
            {baseUrl}
          </Text>
        </VStack>
      </HStack>
      <VStack pt="$8">
        <HStack justifyContent="space-between" alignItems="center" space="md">
          <CustomButton
            onPress={onSubscribePress}
            icon={
              community.subscribed === "Subscribed" ||
              community.subscribed === "Pending"
                ? "heart.fill"
                : "heart"
            }
            text={
              community.subscribed === "Subscribed" ||
              community.subscribed === "Pending"
                ? t("Subscribed")
                : t("Subscribe")
            }
          />
          <CustomButton
            onPress={onAboutPress}
            icon="info.circle"
            text={t("community.info")}
          />
          <CustomButton onPress={() => {}} icon="plus" text={t("Post")} />
        </HStack>
      </VStack>
    </VStack>
  );
}

export default React.memo(CommunityHeader);
