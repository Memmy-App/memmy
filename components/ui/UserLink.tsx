import React from "react";
import { Text } from "native-base";
import Link from "./Link";

function UserLink({
  username,
  fullUsername,
}: {
  username: string;
  fullUsername: string;
}) {
  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <Link
      screen="UserProfile"
      params={{
        fullUsername,
      }}
    >
      <Text fontWeight="medium">{username}</Text>
    </Link>
  );
}

export default UserLink;
