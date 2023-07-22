import React from "react";
import { useTheme } from "native-base";
import { Text } from "@components/common/Gluestack";
import Link from "./Link";

function UserLink({
  username,
  fullUsername,
}: {
  username: string;
  fullUsername: string;
}) {
  const theme = useTheme();
  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <Link
      screen="Profile"
      params={{
        fullUsername,
      }}
    >
      <Text fontWeight="normal" color={theme.colors.app.textSecondary}>
        {username}
      </Text>
    </Link>
  );
}

export default UserLink;
