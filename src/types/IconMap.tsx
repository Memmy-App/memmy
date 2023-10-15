import {
  ArrowDown,
  ArrowUp,
  Bookmark,
  BookmarkCheck,
  CircleEllipsis,
  MessageCircle,
} from '@tamagui/lucide-icons';

export const IconMap = {
  dots: CircleEllipsis,
  upvote: ArrowUp,
  downvote: ArrowDown,
  undefined: CircleEllipsis,
  reply: MessageCircle,
  comment: MessageCircle,
  save: Bookmark,
  saved: BookmarkCheck,
};

export type IconType = keyof typeof IconMap;
