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
import { useActionSheet } from "@expo/react-native-action-sheet";
import useProfile from "../../../hooks/profile/useProfile";
import HeaderIconButton from "../../common/Buttons/HeaderIconButton";
import LoadingErrorView from "../../common/Loading/LoadingErrorView";
import LoadingView from "../../common/Loading/LoadingView";
import NotFoundView from "../../common/Loading/NotFoundView";
import ProfileHeader from "./components/ProfileHeader";
import { lemmyAuthToken, lemmyInstance } from "../../../LemmyInstance";
import { writeToLog } from "../../../helpers/LogHelper";
import { showToast } from "../../../slices/toast/toastSlice";
import { useAppDispatch } from "../../../../store";
import MTable from "../../common/Table/MTable";
import MCell from "../../common/Table/MCell";
import RefreshControl from "../../common/RefreshControl";

interface IProps {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}

function UserProfileScreen({ route, navigation }: IProps) {
  // Hooks
  const profile = useProfile(true, route?.params?.fullUsername);

  const theme = useTheme();
  const { showActionSheetWithOptions } = useActionSheet();
  const dispatch = useAppDispatch();

  useEffect(() => {
    navigation.setOptions({
      title:
        route.params && route.params.fullUsername
          ? route.params.fullUsername
          : "My Profile",
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
  }, []);

  const onDotsPress = async () => {
    const cancelButtonIndex = 1;

    showActionSheetWithOptions(
      {
        options: ["Block User", "Cancel"],
        cancelButtonIndex,
        userInterfaceStyle: theme.config.initialColorMode,
      },
      async (index) => {
        if (index === cancelButtonIndex) return;

        if (index === 0) {
          try {
            await lemmyInstance.blockPerson({
              auth: lemmyAuthToken,
              person_id: profile.profile.person.id,
              block: true,
            });

            dispatch(
              showToast({
                message: "User blocked successfully.",
                duration: 3000,
                variant: "info",
              })
            );
          } catch (e) {
            writeToLog("Error blocking person.");
            writeToLog(e.toString());
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
            title="View Comments"
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
            title="View Posts"
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
            title="View Saved Posts"
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
