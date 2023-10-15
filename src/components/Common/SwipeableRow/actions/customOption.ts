import { SwipeableActionParams } from '@components/Common/SwipeableRow/actions/swipeableActions';

export const customOption = (params: SwipeableActionParams): void => {
  const { custom } = params;

  if (custom == null) return;

  custom(params);
};
