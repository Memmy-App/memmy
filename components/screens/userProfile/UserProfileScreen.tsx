import React, { useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme, View, VStack } from "native-base";
import { IconSettings } from "tabler-icons-react-native";
import PagerView from "react-native-pager-view";
import useProfile from "../../hooks/profile/useProfile";
import HeaderIconButton from "../../ui/buttons/HeaderIconButton";
import LoadingErrorView from "../../ui/Loading/LoadingErrorView";
import LoadingView from "../../ui/Loading/LoadingView";
import NotFoundView from "../../ui/Loading/NotFoundView";
import ProfileCommentList from "../../ui/profile/ProfileCommentList";
import ProfilePostList from "../../ui/profile/ProfilePostList";
import ProfileSavedPostList from "../../ui/profile/ProfileSavedPostList";
import ProfileHeader from "../../ui/profile/ProfileHeader";

interface IProps {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}

function UserProfileScreen({ route, navigation }: IProps) {
  // Hooks
  const profile = useProfile(
    route.params && route.params.fullUsername
      ? route.params.fullUsername
      : undefined
  );
  const theme = useTheme();

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
          : undefined,
    });
  }, []);

  if (!profile.profile) {
    return <LoadingView />;
  }

  if (profile.error) {
    return <LoadingErrorView onRetryPress={() => profile.doLoad(true)} />;
  }

  if (profile.notFound) {
    return <NotFoundView />;
  }

  const header = <ProfileHeader profile={profile} />;

  return (
    <VStack flex={1} backgroundColor={theme.colors.app.bg}>
      <PagerView
        initialPage={0}
        style={{ flex: 1 }}
        scrollEnabled={false}
        ref={profile.pagerView}
      >
        <View key="1">
          <ProfileCommentList profile={profile} header={header} />
        </View>
        <View key="2">
          <ProfilePostList profile={profile} header={header} />
        </View>
        {profile.savedPosts && (
          <View key="3">
            <ProfileSavedPostList profile={profile} header={header} />
          </View>
        )}
      </PagerView>
    </VStack>
  );
}

export default UserProfileScreen;
