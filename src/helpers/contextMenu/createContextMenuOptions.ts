import { IContextMenuOptions } from '@src/types';
import { capitalizeFirstLetter } from '@helpers/text';

export const createContextMenuOptionsFromStrings = (
  options: string[] | readonly string[],
  addNone = false,
): IContextMenuOptions => {
  const menuOptions = options.map((option: string) => {
    return {
      key: option,
      title: capitalizeFirstLetter(option),
    };
  });

  if (addNone) {
    menuOptions.push({
      key: 'none',
      title: 'None',
    });
  }

  return menuOptions;
};
