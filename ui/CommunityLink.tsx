import React from "react";
import {Community} from "lemmy-js-client";
import {Link} from "expo-router";
import {Text} from "native-base";

interface CommunityLinkProps {
    community: Community
}

const CommunityLink = ({community}: CommunityLinkProps) => {
    return (
        <Link href={{
            pathname: `/tabs/feeds/${community.id}`,
            params: {
                actorId: encodeURIComponent(community.actor_id),
                communityName: community.name
            }
        }}>
            <Text fontWeight={"bold"}>{community.name}</Text>
        </Link>
    );
};

export default CommunityLink;