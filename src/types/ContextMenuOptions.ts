export type ContextMenuOptions = ContextMenuOption[];

export interface ContextMenuOption {
  title: string;
  key: string;
  subtitle?: string;
  icon?: string;
  destructive?: boolean;
  options?: ContextMenuOption[];
  inline?: boolean;
}
