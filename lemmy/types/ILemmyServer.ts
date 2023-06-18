interface ILemmyServer {
  server: string;
  username: string;
  password: string;
  auth?: string;
  totpToken?: string;
}

export default ILemmyServer;
