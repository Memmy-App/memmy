import ILemmyServer from "./types/ILemmyServer";
import {LemmyHttp} from "lemmy-js-client";

export let lemmyInstance: LemmyHttp | null = null;

export const initialize = async (server: ILemmyServer) => {
    lemmyInstance = new LemmyHttp(`https://${server.server}`);
    await lemmyInstance.login({
        username_or_email: server.username,
        password: server.password
    });
};

export const isInitialized = () => lemmyInstance !== null;
