import { LemmyHttp } from "lemmy-js-client";
import { Platform } from "react-native";
import { getReadableVersion } from "react-native-device-info";
import ILemmyCredentials from "./types/lemmy/ILemmyCredentials";
import { writeToLog } from "./helpers/LogHelper";

// eslint-disable-next-line import/no-mutable-exports
let lemmyInstance: LemmyHttp | null = null;
// eslint-disable-next-line import/no-mutable-exports
let lemmyAuthToken: string | undefined;

let errorMessage: string | undefined;

export const resetInstance = () => {
  writeToLog("Clearing instance.");
  lemmyInstance = null;
};

const createInstance = (server: string): LemmyHttp => {
  const os = Platform.OS;
  return new LemmyHttp(`https://${server}`, {
    fetchFunction: undefined,
    headers: {
      "User-Agent": `Memmy ${os} ${getReadableVersion()}`,
    },
  });
};

const initialize = async (server: string, token: string) => {
  lemmyInstance = createInstance(server);

  writeToLog(`Initializing instance. ${server}`);

  if (token) {
    writeToLog("Existing authentication token found.");
    lemmyAuthToken = token;
  } else {
    writeToLog("No authentication token found for instance.");
    throw Error("Error initializing account.");
  }
};

const login = async (creds: ILemmyCredentials): Promise<boolean> => {
  const lemmyLoginClient = createInstance(creds.server);

  writeToLog(`Attempting login to instance. ${creds.server}`);

  const args = {
    username_or_email: creds.username,
    password: creds.password,
    totp_2fa_token: creds.totpToken || undefined,
  };

  try {
    const res = await lemmyLoginClient.login(args);
    lemmyInstance = lemmyLoginClient;
    lemmyAuthToken = res.jwt;
    return true;
  } catch (e) {
    writeToLog("Error logging into instance.");
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
  login,
  getInstanceError,
  errorToMessage,
};
