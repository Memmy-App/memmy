import React, { useEffect, useRef } from "react";
import { HStack, Text, VStack } from "@src/components/common/Gluestack";
import { useAppSelector } from "@root/store";
import FastImage from "@gkasdorf/react-native-fast-image";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import {
  useCommunity,
  useCommunityStatus,
} from "../../../../../stores/communities/communitiesStore";
import { PlanetIcon } from "../../../../common/icons/PlanetIcon";
import { shortenNumber } from "../../../../../helpers/NumberHelper";
import { getBaseUrl } from "../../../../../helpers/LinkHelper";
import CustomButton from "../../../../common/Buttons/CustomButton";
import { SFIcon } from "../../../../common/icons/SFIcon";
import setCommunitySubscribed from "../../../../../stores/communities/actions/setCommunitySubscribed";
import { selectPost } from "../../../../../slices/post/postSlice";
import { addPost } from "../../../../../stores/posts/actions";
import { ICON_MAP } from "../../../../../constants/IconMap";

interface IProps {
  communityFullName: string;
}

function CommunityHeader({ communityFullName }: IProps) {
  const theme = useThemeOptions();
  const { t } = useTranslation();

  const community = useCommunity(communityFullName);
  const communityStatus = useCommunityStatus(communityFullName);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const { post } = useAppSelector(selectPost);

  const creatingPost = useRef<boolean>(false);
  const lastPost = useRef<number>(0);

  useEffect(() => {
    if (creatingPost.current && post && lastPost.current !== post.post.id) {
      creatingPost.current = false;

      const key = Date.now().toString() + post.post.id.toString();

      addPost(key, post);

      setTimeout(() => {
        navigation.push("Post", {
          postKey: key,
        });
      }, 500);
    }
  }, [post]);

  const onSubscribePress = () => {
    setCommunitySubscribed(communityFullName).then();
  };

  const onAboutPress = () => {
    navigation.push("CommunityAbout", {
      communityFullName,
    });
  };

  const onPostPress = () => {
    creatingPost.current = true;
    lastPost.current = post ? post.post.id : 0;

    navigation.push("NewPost", {
      communityFullName,
    });
  };

  if (!community || communityStatus.loading) return null;

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
          <PlanetIcon color={theme.colors.textSecondary} size={64} />
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
              <Text color={theme.colors.textSecondary}>
                {shortenNumber(community.counts.subscribers)}
              </Text>
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
            {getBaseUrl(community.community.actor_id)}
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
          <CustomButton onPress={onPostPress} icon="plus" text={t("Post")} />
        </HStack>
      </VStack>
    </VStack>
  );
}

export default React.memo(CommunityHeader);
