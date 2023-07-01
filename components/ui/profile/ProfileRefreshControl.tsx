import React from "react";
import { RefreshControl } from "react-native";
import { UseProfile } from "../../hooks/profile/useProfile";

interface IProps {
  profile: UseProfile;
}

export function ProfileRefreshControl({ profile }: IProps) {
  return (
    <RefreshControl
      refreshing={profile.refreshing}
      onRefresh={() => {
        profile.doLoad(true).then();
      }}
    />
  );
}
