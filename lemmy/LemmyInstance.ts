import { LemmyHttp } from "lemmy-js-client";
import { Platform } from "react-native";
import { getReadableVersion } from "react-native-device-info";
import ILemmyServer from "./types/ILemmyServer";
import { writeToLog } from "../helpers/LogHelper";

// eslint-disable-next-line import/no-mutable-exports
let lemmyInstance: LemmyHttp | null = null;
// eslint-disable-next-line import/no-mutable-exports
let lemmyAuthToken: string | undefined;

let errorMessage: string | undefined;

export const resetInstance = () => {
  writeToLog("Clearing instance.");
  lemmyInstance = null;
};

const initialize = async (server: ILemmyServer): Promise<boolean> => {
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
    return true;
  } catch (e) {
    writeToLog("Error initializing instance.");
    writeToLog(e.toString());

    errorMessage = e.toString();
    return false;
  }
};

const getInstanceError = () => errorToMessage(errorMessage);

const errorToMessage = (error: string) => {
  switch (error) {
    case "password_incorrect":
      return "You have entered an invalid username or password.";
    case "missing_totp_token":
      return "missing_totp_token";
    default:
      return `Unknown error occurred. Here is more info: ${error}`;
  }
};

export {
  lemmyInstance,
  lemmyAuthToken,
  initialize,
  getInstanceError,
  errorToMessage,
};
