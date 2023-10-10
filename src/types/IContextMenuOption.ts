export type IContextMenuOptions = IContextMenuOption[];

export interface IContextMenuOption {
  title: string;
  key: string;
  subtitle?: string;
  icon?: string;
  destructive?: boolean;
  options?: IContextMenuOption[];
  inline?: boolean;
}
