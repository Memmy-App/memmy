export interface IBackEventArgs {
  type: string;
  payload?: object | undefined;
  source?: string | undefined;
  target?: string | undefined;
}

export interface IBackEvent {
  action: Readonly<IBackEventArgs>;
}
