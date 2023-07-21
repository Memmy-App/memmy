import React, { useEffect, useRef } from "react";
import { HStack, Text, useTheme, VStack } from "native-base";
import FastImage from "@gkasdorf/react-native-fast-image";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  useCommunity,
  useCommunityStatus,
} from "../../../../stores/communities/communitiesStore";
import { PlanetIcon } from "../../../common/icons/PlanetIcon";
import { shortenNumber } from "../../../../helpers/NumberHelper";
import { getBaseUrl } from "../../../../helpers/LinkHelper";
import CustomButton from "../../../common/Buttons/CustomButton";
import { SFIcon } from "../../../common/icons/SFIcon";
import setCommunitySubscribed from "../../../../stores/communities/actions/setCommunitySubscribed";
import { useAppSelector } from "../../../../../store";
import { selectPost } from "../../../../slices/post/postSlice";
import { addPost } from "../../../../stores/posts/actions";

interface IProps {
  communityFullName: string;
}

function CommunityHeader({ communityFullName }: IProps) {
  const theme = useTheme();
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
    <VStack pt={10} pb={5} px={5}>
      <HStack alignItems="center" space={5}>
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
          <PlanetIcon color={theme.colors.app.textSecondary} size={64} />
        )}

        <VStack alignContent="center">
          <HStack space={3}>
            <HStack alignItems="center">
              <SFIcon
                icon="person"
                color={theme.colors.app.textSecondary}
                size={12}
                boxSize={18}
              />
              <Text color={theme.colors.app.textSecondary}>
                {shortenNumber(community.counts.subscribers)}
              </Text>
            </HStack>
            <HStack space={1} alignItems="center">
              <SFIcon
                icon="eye"
                color={theme.colors.app.textSecondary}
                size={12}
                boxSize={18}
              />
              <Text color={theme.colors.app.textSecondary}>
                {community.counts.users_active_month}
              </Text>
            </HStack>
          </HStack>
          <Text fontSize="3xl" fontWeight="bold">
            {community.community.name}
          </Text>
          <Text fontSize="md" color={theme.colors.app.textSecondary} mt={-2}>
            {getBaseUrl(community.community.actor_id)}
          </Text>
        </VStack>
      </HStack>
      <VStack pt={8}>
        <HStack justifyContent="space-between" alignItems="center" space={3}>
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
            text={t("About")}
          />
          <CustomButton onPress={onPostPress} icon="plus" text={t("Post")} />
        </HStack>
      </VStack>
    </VStack>
  );
}

export default React.memo(CommunityHeader);
