export type AppIconType =
  | 'purple_icon'
  | 'blue_icon'
  | 'green_icon'
  | 'yellow_icon'
  | 'red_icon'
  | 'pink_icon'
  | 'brown_icon'
  | 'gray_icon'
  | 'light_gray_icon'
  | 'pride_icon'
  | 'pride_new_icon'
  | 'trans_pride_icon';

export const appIconOptions: Record<
  AppIconType,
  { display: string, path: any, }
> = {
  purple_icon: {
    display: 'Purple (Default)',
    path: require('../../assets/icons/purple_small.png'),
  },
  blue_icon: {
    display: 'Blue',
    path: require('../../assets/icons/blue_small.png'),
  },
  green_icon: {
    display: 'Green',
    path: require('../../assets/icons/green_small.png'),
  },
  yellow_icon: {
    display: 'Yellow',
    path: require('../../assets/icons/yellow_small.png'),
  },
  red_icon: {
    display: 'Purple',
    path: require('../../assets/icons/red_small.png'),
  },
  pink_icon: {
    display: 'Purple',
    path: require('../../assets/icons/pink_small.png'),
  },
  brown_icon: {
    display: 'Purple',
    path: require('../../assets/icons/brown_small.png'),
  },
  gray_icon: {
    display: 'Purple',
    path: require('../../assets/icons/gray_small.png'),
  },
  light_gray_icon: {
    display: 'Purple',
    path: require('../../assets/icons/light_gray_small.png'),
  },
  pride_icon: {
    display: 'Purple',
    path: require('../../assets/icons/pride_small.png'),
  },
  pride_new_icon: {
    display: 'Purple',
    path: require('../../assets/icons/pride_small.png'),
  },
  trans_pride_icon: {
    display: 'Purple',
    path: require('../../assets/icons/trans_pride_small.png'),
  },
};
