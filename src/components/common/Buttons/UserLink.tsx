import React from "react";
import { Text } from "@src/components/common/Gluestack";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";
import Link from "./Link";

function UserLink({
  username,
  fullUsername,
}: {
  username: string;
  fullUsername: string;
}) {
  const theme = useAppSelector(selectThemeOptions);
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
