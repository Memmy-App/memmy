import {
  BaseContextMenuOption,
  ContextMenuOption,
} from "../types/ContextMenuOptions";

export const findOptionByKey = <
  T extends BaseContextMenuOption = ContextMenuOption
>(
  options: T[],
  key: string
) => options.find((option) => option.key === key);
