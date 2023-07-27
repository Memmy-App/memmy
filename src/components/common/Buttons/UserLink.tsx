import React from "react";
import { Text } from "@src/components/common/Gluestack";
import { useThemeOptions } from "@src/stores/settings/settingsStore";
import Link from "./Link";

function UserLink({
  username,
  fullUsername,
}: {
  username: string;
  fullUsername: string;
}) {
  const theme = useThemeOptions();
  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <Link
      screen="Profile"
      params={{
        fullUsername,
      }}
    >
      <Text fontWeight="normal" color={theme.colors.textSecondary}>
        {username}
      </Text>
    </Link>
  );
}

export default UserLink;
