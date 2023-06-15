import ILemmyServer from "./types/ILemmyServer";
import {LemmyHttp} from "lemmy-js-client";

export let lemmyInstance: LemmyHttp | null = null;
export let lemmyAuthToken: string | undefined = undefined;

export const initialize = async (server: ILemmyServer) => {
    lemmyInstance = new LemmyHttp(`https://${server.server}`);

    if(server.auth) {
        lemmyAuthToken = server.auth;
    } else {
        const args = {
            username_or_email: server.username,
            password: server.password
        };

        if (server.totpToken) {
            args["totp_2fa_token"] = server.totpToken;
        }

        const res = await lemmyInstance.login(args);

        lemmyAuthToken = res.jwt;
    }
};
