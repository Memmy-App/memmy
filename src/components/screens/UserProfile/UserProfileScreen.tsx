import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView, useTheme, VStack } from "native-base";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ContextMenuButton } from "react-native-ios-context-menu";
import { useAppDispatch } from "../../../../store";
import { ICON_MAP } from "../../../constants/IconMap";
import useProfile from "../../../hooks/profile/useProfile";
import { useBlockUser } from "../../../hooks/user/useBlockUser";
import HeaderIconButton from "../../common/Buttons/HeaderIconButton";
import SFIcon from "../../common/icons/SFIcon";
import LoadingErrorView from "../../common/Loading/LoadingErrorView";
import LoadingView from "../../common/Loading/LoadingView";
import NotFoundView from "../../common/Loading/NotFoundView";
import RefreshControl from "../../common/RefreshControl";
import MCell from "../../common/Table/MCell";
import MTable from "../../common/Table/MTable";
import ProfileHeader from "./components/ProfileHeader";

interface IProps {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}

function UserProfileScreen({ route, navigation }: IProps) {
  // Hooks
  const profile = useProfile(true, route?.params?.fullUsername);

  const theme = useTheme();
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
                icon={<SFIcon icon="gear" />}
                onPress={() => navigation.push("Settings")}
              />
            )
          : () => (
              <ContextMenuButton
                isMenuPrimaryAction
                onPressMenuItem={({ nativeEvent }) => {
                  if (nativeEvent.actionKey === "BlockUser") {
                    useBlockUser({
                      personId: profile.profile.person.id,
                      dispatch,
                      t,
                    });
                  }
                }}
                menuConfig={{
                  menuTitle: "",
                  // @ts-ignore Types for menuItems are wrong for this library
                  menuItems: [
                    {
                      actionKey: "BlockUser",
                      actionTitle: "Block User",
                      icon: {
                        type: "IMAGE_SYSTEM",
                        imageValue: {
                          systemName: "person.crop.circle.badge.xmark",
                        },
                      },
                    },
                  ],
                }}
              >
                <HeaderIconButton icon={<SFIcon icon="ellipsis" />} />
              </ContextMenuButton>
            ),
    });
  }, [profile.profile, t]);

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
            icon={<SFIcon icon={ICON_MAP.REPLY} size={14} />}
            showChevron
            onPress={() =>
              navigation.push("UserComments", {
                fullUsername: route?.params?.fullUsername,
              })
            }
          />
          <MCell
            title={t("View Posts")}
            icon={<SFIcon icon="doc.plaintext" size={14} />}
            showChevron
            onPress={() =>
              navigation.push("UserPosts", {
                fullUsername: route?.params?.fullUsername,
              })
            }
          />
          {profile.self && (
            <MCell
              title={t("View Saved Posts")}
              icon={<SFIcon icon={ICON_MAP.SAVE} size={14} />}
              showChevron
              onPress={() =>
                navigation.push("UserPosts", {
                  fullUsername: route?.params?.fullUsername,
                  isSavedPosts: true,
                })
              }
            />
          )}
        </MTable>
      </VStack>
    </ScrollView>
  );
}

export default UserProfileScreen;
