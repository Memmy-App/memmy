import React, { useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView, useTheme, VStack } from "native-base";
import {
  IconBookmark,
  IconChevronRight,
  IconDots,
  IconMessage,
  IconNotes,
  IconSettings,
} from "tabler-icons-react-native";
import { useTranslation } from "react-i18next";
import useProfile from "../../../hooks/profile/useProfile";
import HeaderIconButton from "../../common/Buttons/HeaderIconButton";
import LoadingErrorView from "../../common/Loading/LoadingErrorView";
import LoadingView from "../../common/Loading/LoadingView";
import NotFoundView from "../../common/Loading/NotFoundView";
import ProfileHeader from "./components/ProfileHeader";
import { lemmyAuthToken, lemmyInstance } from "../../../LemmyInstance";
import { showToast } from "../../../slices/toast/toastSlice";
import { useAppDispatch } from "../../../../store";
import MTable from "../../common/Table/MTable";
import MCell from "../../common/Table/MCell";
import RefreshControl from "../../common/RefreshControl";
import { handleLemmyError } from "../../../helpers/LemmyErrorHelper";
import { useAppActionSheet } from "../../../hooks/app/useAppActionSheet";

interface IProps {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}

function UserProfileScreen({ route, navigation }: IProps) {
  // Hooks
  const profile = useProfile(true, route?.params?.fullUsername);

  const theme = useTheme();
  const { showAppActionSheetWithOptions } = useAppActionSheet();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    navigation.setOptions({
      title:
        route.params && route.params.fullUsername
          ? route.params.fullUsername
          : t("profile.my"),
      headerRight:
        !route.params || !route.params.fullUsername
          ? () => (
              <HeaderIconButton
                icon={
                  <IconSettings size={24} color={theme.colors.app.accent} />
                }
                onPress={() => navigation.push("Settings")}
              />
            )
          : () => (
              <HeaderIconButton
                icon={<IconDots size={24} color={theme.colors.app.accent} />}
                onPress={onDotsPress}
              />
            ),
    });
  }, [profile.profile, t]);

  const onDotsPress = async () => {
    const cancelButtonIndex = 1;

    showAppActionSheetWithOptions(
      {
        options: ["Block User", "Cancel"],
        cancelButtonIndex,
      },
      async (index) => {
        if (index === 0) {
          try {
            await lemmyInstance.blockPerson({
              auth: lemmyAuthToken,
              person_id: profile.profile.person.id,
              block: true,
            });

            dispatch(
              showToast({
                message: t("toast.userBlockedSuccess"),
                duration: 3000,
                variant: "info",
              })
            );
          } catch (e) {
            handleLemmyError(e.toString());
          }
        }
      }
    );
  };

  if (!profile.profile) {
    return <LoadingView />;
  }

  if (profile.error) {
    return <LoadingErrorView onRetryPress={profile.doLoad} />;
  }

  if (profile.notFound) {
    return <NotFoundView />;
  }

  return (
    <ScrollView
      flex={1}
      backgroundColor={theme.colors.app.bg}
      refreshControl={
        <RefreshControl
          refreshing={profile.refreshing}
          onRefresh={profile.doLoad}
        />
      }
    >
      <ProfileHeader profile={profile} />
      <VStack p={4}>
        <MTable>
          <MCell
            title={t("View Comments")}
            icon={<IconMessage color={theme.colors.app.accent} />}
            rightAccessory={
              <IconChevronRight color={theme.colors.app.accent} />
            }
            onPress={() =>
              navigation.push("UserComments", {
                fullUsername: route?.params?.fullUsername,
              })
            }
          />
          <MCell
            title={t("View Posts")}
            icon={<IconNotes color={theme.colors.app.accent} />}
            rightAccessory={
              <IconChevronRight color={theme.colors.app.accent} />
            }
            onPress={() =>
              navigation.push("UserPosts", {
                fullUsername: route?.params?.fullUsername,
              })
            }
          />
          <MCell
            title={t("View Saved Posts")}
            icon={<IconBookmark color={theme.colors.app.accent} />}
            rightAccessory={
              <IconChevronRight color={theme.colors.app.accent} />
            }
            onPress={() =>
              navigation.push("UserPosts", {
                fullUsername: route?.params?.fullUsername,
                isSavedPosts: true,
              })
            }
          />
        </MTable>
      </VStack>
    </ScrollView>
  );
}

export default UserProfileScreen;
