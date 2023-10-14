import { ArrowDown, ArrowUp, CircleEllipsis } from '@tamagui/lucide-icons';

export const IconMap = {
  dots: CircleEllipsis,
  upvote: ArrowUp,
  downvote: ArrowDown,
};

export type IconType = keyof typeof IconMap;
