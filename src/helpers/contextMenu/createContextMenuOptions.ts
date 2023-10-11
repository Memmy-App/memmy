import { IContextMenuOptions } from '@src/types';
import { capitalizeFirstLetter } from '@helpers/text';

export const createContextMenuOptionsFromStrings = (
  options: string[] | readonly string[],
): IContextMenuOptions => {
  const menuOptions = options.map((option: string) => {
    return {
      key: option,
      title: capitalizeFirstLetter(option),
    };
  });

  return menuOptions;
};

