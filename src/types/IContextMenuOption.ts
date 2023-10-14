export type IContextMenuOptions<Type = string> = Array<
  IContextMenuOption<Type>
>;

export interface IContextMenuOption<Type = string> {
  title: string;
  key: Type;
  subtitle?: string;
  icon?: string;
  destructive?: boolean;
  options?: Array<IContextMenuOption<Type>>;
  inline?: boolean;
}
