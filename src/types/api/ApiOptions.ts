export default interface ApiOptions {
  type: "lemmy" | "kbin";
  host: string;
  username: string;
  password?: string;
  authToken?: string;
  totpToken?: string;
}
