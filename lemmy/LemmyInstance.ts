import { LemmyHttp } from "lemmy-js-client";
import ILemmyServer from "./types/ILemmyServer";
import { writeToLog } from "../helpers/LogHelper";

export let lemmyInstance: LemmyHttp | null = null;
export let lemmyAuthToken: string | undefined;

export const resetInstance = () => {
  writeToLog("Clearing instance.");
  lemmyInstance = null;
};

export const initialize = async (server: ILemmyServer) => {
  lemmyInstance = new LemmyHttp(`https://${server.server}`);

  writeToLog(`Attempting to initialize instance. ${server.server}`);

  if (server.auth) {
    writeToLog("Already authenticated. Using existing authentication token.");
    lemmyAuthToken = server.auth;
  } else {
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
    } catch (e) {
      writeToLog("Error initializing instance.");
      writeToLog(e.toString());
    }
  }
};
