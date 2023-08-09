export default interface ILemmyServer {
  host: string;
  username: string;
  password?: string;
  authToken?: string;
  totpToken?: string;
}
