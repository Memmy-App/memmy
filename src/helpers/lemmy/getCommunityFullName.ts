import { getBaseUrl } from "@src/helpers/links";
import { CommunityView } from "lemmy-js-client";

export const getCommunityFullName = (
  community: CommunityView | undefined
): string => {
  if (!community) return "";

  return `${community?.community?.name}@${getBaseUrl(
    community?.community?.actor_id
  )}`;
};
