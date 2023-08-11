import { useAccountStore } from "@src/state/account/accountStore";
import { writeToLog } from "@src/helpers/debug/DebugHelper";

export const getCommunityLink = (sublink: string): string => {
  const { currentAccount } = useAccountStore.getState();

  let instanceUrl = currentAccount!.host;

  if (
    !instanceUrl.startsWith("https://") &&
    !instanceUrl.startsWith("http://")
  ) {
    instanceUrl = `https://${instanceUrl}`;
  }

  // Handle shortcut links that are formatted: "/c/community@instance". Need to prepend the home instance url
  if (sublink[0] === "/") {
    if (instanceUrl === "") {
      writeToLog(
        `Trying to open link: ${sublink} with instanceUrl: ${instanceUrl}`
      );
      return "";
    }
    sublink = instanceUrl + sublink;
    return sublink;
  }
  return sublink;
};
