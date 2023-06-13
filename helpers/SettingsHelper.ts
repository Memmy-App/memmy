import ILemmyServer from "../lemmy/types/ILemmyServer";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getServers = async (): Promise<ILemmyServer[] | null> => {
    const serversStr = await AsyncStorage.getItem("@servers");

    if(!serversStr) return null;

    return JSON.parse(serversStr) as ILemmyServer[];
};