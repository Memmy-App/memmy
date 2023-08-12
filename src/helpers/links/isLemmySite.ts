import { getCommunityLink } from "@src/helpers/links/getCommunityLink";
import { writeToLog } from "@src/helpers/debug/DebugHelper";
import axios from "axios";

export const isLemmySite = async (link: string): Promise<boolean> => {
  link = getCommunityLink(link);
  if (link === "") {
    return false;
  }

  let urlComponents;
  try {
    urlComponents = new URL(link);
  } catch (e: any) {
    writeToLog(
      `Failed to make components from link: ${link}Err: ${e.toString()}`
    );
    return false;
  }

  // Try lemmy api to verify this is a valid lemmy instance
  const apiUrl = `${urlComponents.protocol}//${urlComponents.hostname}/api/v3/site`;
  try {
    const resp = await axios.get(apiUrl);
    return !!resp.data.site_view.site.name;
  } catch (e) {
    return false;
  }
};
