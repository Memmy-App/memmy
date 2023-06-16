import React from "react";
import {Community} from "lemmy-js-client";
import {Text} from "native-base";
import Link from "./Link";

interface CommunityLinkProps {
    community: Community;
    isFeedItem?: boolean;
}

const CommunityLink = ({community, isFeedItem}: CommunityLinkProps) => {
    return (
        <Link screen={"Community"} params={{
            communityId: community.id,
            actorId: community.actor_id,
            communityName: community.name
        }}>

            <Text color={isFeedItem && "gray.400"} fontWeight={"bold"}>{community.name}</Text>
        </Link>
    );
};

export default CommunityLink;