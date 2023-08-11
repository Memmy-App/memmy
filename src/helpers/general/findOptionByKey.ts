import { ContextMenuOption } from "@src/types/ContextMenuOptions";

export const findOptionByKey = (options: ContextMenuOption[], key: string) =>
  options.find((option) => option.key === key);
