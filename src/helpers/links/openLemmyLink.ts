import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getBaseUrl } from "@src/helpers/links/getBaseUrl";
import { openWebLink } from "@src/helpers/links/openWebLink";

export const openLemmyLink = (
  link: string,
  navigation: NativeStackNavigationProp<any>,
  color: string
): void => {
  const communityOnEnd = link.includes("@");

  let baseUrl;
  let community;

  if (communityOnEnd) {
    baseUrl = link.split("@").pop();

    community = link
      .split(/\/[cmu]\//)
      .pop()
      ?.split("@")[0];
  } else {
    baseUrl = getBaseUrl(link);
    community = link.split("/").pop();
  }

  if (link.includes("/u/")) {
    navigation.push("Profile", {
      fullUsername: `${community}@${baseUrl}`,
    });
    // TODO: Handle other type of lemmy links
    // } else if (link.includes("/Post/")) {
    //   navigation.push("Post");
  } else if (link.includes("/c/")) {
    navigation.push("Community", {
      communityFullName: `${community}@${baseUrl}`,
      communityName: community,
      actorId: baseUrl,
    });
  } else {
    // In case the link type is not handled, open in a browser
    openWebLink(link, color);
  }
};
