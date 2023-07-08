export interface Account {
  username: string;
  instance: string;
  token?: string;
  tokenKey?: string;
  isCurrent?: boolean;
}
