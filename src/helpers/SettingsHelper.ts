import AsyncStorage from "@react-native-async-storage/async-storage";
import ILemmyServer from "../types/lemmy/ILemmyServer";

export const getServers = async (): Promise<ILemmyServer[] | null> => {
  const serversStr = await AsyncStorage.getItem("@servers");

  if (!serversStr) return null;

  return JSON.parse(serversStr) as ILemmyServer[];
};

export const addServer = async (server: ILemmyServer) => {
  const servers = (await getServers()) ?? [];
  servers.push(server);
  await AsyncStorage.setItem("@servers", JSON.stringify(servers));
};

export const setServers = async (servers: ILemmyServer[]) => {
  await AsyncStorage.setItem("@servers", JSON.stringify(servers));
};
