import { SwipeableActionParams } from '@helpers/swipeableActions/swipeableActions';

export const customOption = (params: SwipeableActionParams): void => {
  const { custom } = params;

  if (custom == null) return;

  custom(params);
};
