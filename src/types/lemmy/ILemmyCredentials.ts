interface ILemmyCredentials {
  server: string;
  username: string;
  password: string;
  totpToken?: string;
}

export default ILemmyCredentials;
