import { LemmyHttp } from "lemmy-js-client";
import { Platform } from "react-native";
import { getReadableVersion } from "react-native-device-info";
import { useSiteStore } from "@src/stores/site/siteStore";
import ILemmyServer from "./types/lemmy/ILemmyServer";
import { writeToLog } from "./helpers/LogHelper";
import { handleLemmyError } from "./helpers/LemmyErrorHelper";

// eslint-disable-next-line import/no-mutable-exports
let lemmyInstance: LemmyHttp | null = null;
// eslint-disable-next-line import/no-mutable-exports
let lemmyAuthToken: string | undefined;

let errorMessage: string | undefined;

export const resetInstance = () => {
  writeToLog("Clearing instance.");
  lemmyInstance = null;
  lemmyAuthToken = null;
};

const initialize = async (server: ILemmyServer): Promise<boolean> => {
  resetInstance();

  const os = Platform.OS;
  lemmyInstance = new LemmyHttp(`https://${server.server}`, {
    fetchFunction: undefined,
    headers: {
      "User-Agent": `Memmy ${os} ${getReadableVersion()}`,
    },
  });

  writeToLog(`Attempting to initialize instance. ${server.server}`);

  if (server.auth) {
    writeToLog("Already authenticated. Using existing authentication token.");
    lemmyAuthToken = server.auth;
    useSiteStore.getState().init();
    return true;
  }
  writeToLog("Attempting login.");
  const args = {
    username_or_email: server.username,
    password: server.password,
    totp_2fa_token: undefined,
  };

  if (server.totpToken) {
    args.totp_2fa_token = server.totpToken;
  }

  try {
    const res = await lemmyInstance.login(args);
    lemmyAuthToken = res.jwt;

    // Load the site info
    useSiteStore.getState().init();
    return true;
  } catch (e) {
    resetInstance();
    errorMessage = e.toString();
    handleLemmyError(e.toString());
    return false;
  }
};

const getInstanceError = () => errorMessage;

export { lemmyInstance, lemmyAuthToken, initialize, getInstanceError };
