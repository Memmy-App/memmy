export interface IAccount {
  instance: string;
  username: string;
  fullUsername: string;
  token?: string;
  isCurrentAccount: boolean;
  notificationsEnabled: boolean;
}
