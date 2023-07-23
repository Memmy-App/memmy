export type ContextMenuOptions = RootContextMenuOption[];

export interface BaseContextMenuOption {
  key: string;
  title?: string;
  subtitle?: string;
  icon?: string;
  destructive?: boolean;
}

export interface ContextMenuOption extends BaseContextMenuOption {
  title: string;
}

export interface RootContextMenuOption extends BaseContextMenuOption {
  title?: string;
  options?: ContextMenuOption[];
  inline?: boolean;
}
