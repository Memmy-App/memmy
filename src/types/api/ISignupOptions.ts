export default interface ISignupOptions {
  email: string;
  showNsfw: boolean;
  captchaUuid?: string;
  captchaAnswer?: string;
}
