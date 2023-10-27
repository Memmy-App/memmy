import {
  CommentReplyView,
  Person,
  PersonMentionView,
  PrivateMessageView,
} from 'lemmy-js-client';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface InboxStore {
  privateMessages: Map<number, PrivateMessageView>;
  replies: Map<number, CommentReplyView>;
  mentions: Map<number, PersonMentionView>;

  privateMessageIds: number[];
  replyIds: number[];
  mentionIds: number[];
}

export const useInboxStore = create(
  immer<InboxStore>(() => ({
    privateMessages: new Map<number, PrivateMessageView>(),
    replies: new Map<number, CommentReplyView>(),
    mentions: new Map<number, PersonMentionView>(),

    privateMessageIds: [],
    replyIds: [],
    mentionIds: [],
  })),
);

export const usePrivateMessages = (): number[] =>
  useInboxStore((state) => state.privateMessageIds);
export const useReplies = (): number[] =>
  useInboxStore((state) => state.replyIds);
export const useMentions = (): number[] =>
  useInboxStore((state) => state.mentionIds);

export const usePrivateMessage = (id: number): PrivateMessageView | undefined =>
  useInboxStore((state) => state.privateMessages.get(id));

export const useReply = (id: number): CommentReplyView | undefined =>
  useInboxStore((state) => state.replies.get(id));

export const useMention = (id: number): PersonMentionView | undefined =>
  useInboxStore((state) => state.mentions.get(id));

export const useReplyPostId = (id: number): number | undefined =>
  useInboxStore((state) => state.replies.get(id)?.post.id);

export const useReplyCommentId = (id: number): number | undefined =>
  useInboxStore((state) => state.replies.get(id)?.comment.id);

export const useReplyContent = (id: number): string | undefined =>
  useInboxStore((state) => state.replies.get(id)?.comment.content);

export const useReplyRemoved = (id: number): boolean =>
  useInboxStore((state) => state.replies.get(id)?.comment.removed) ?? false;

export const useReplyDeleted = (id: number): boolean =>
  useInboxStore((state) => state.replies.get(id)?.comment.deleted) ?? false;

export const useReplyCreator = (id: number): Person | undefined =>
  useInboxStore((state) => state.replies.get(id)?.creator);

export const useReplyCreatorAvatar = (id: number): string | undefined =>
  useInboxStore((state) => state.replies.get(id)?.creator.avatar);

export const useReplyCreatorName = (id: number): string | undefined =>
  useInboxStore((state) => state.replies.get(id)?.creator.name);

export const useReplyCreatorActorId = (id: number): string | undefined =>
  useInboxStore((state) => state.replies.get(id)?.creator.actor_id);

export const useReplyUpvotes = (id: number): number =>
  useInboxStore((state) => state.replies.get(id)?.counts.upvotes) ?? 0;

export const useReplyDownvotes = (id: number): number =>
  useInboxStore((state) => state.replies.get(id)?.counts.downvotes) ?? 0;

export const useReplyScore = (id: number): number =>
  useInboxStore((state) => state.replies.get(id)?.counts.score) ?? 0;

export const useReplyMyVote = (id: number): number =>
  useInboxStore((state) => state.replies.get(id)?.my_vote) ?? 0;

export const useReplyRead = (id: number): boolean =>
  useInboxStore((state) => state.replies.get(id)?.comment_reply.read) ?? false;

export const useReplyPath = (id: number): string | undefined =>
  useInboxStore((state) => state.replies.get(id)?.comment.path);

export const useReplyPublished = (id: number): string | undefined =>
  useInboxStore((state) => state.replies.get(id)?.counts.published);

export const useMentionPostId = (id: number): number | undefined =>
  useInboxStore((state) => state.mentions.get(id)?.post.id);

export const useMentionCommentId = (id: number): number | undefined =>
  useInboxStore((state) => state.mentions.get(id)?.comment.id);

export const useMentionContent = (id: number): string | undefined =>
  useInboxStore((state) => state.mentions.get(id)?.comment.content);

export const useMentionRemoved = (id: number): boolean =>
  useInboxStore((state) => state.mentions.get(id)?.comment.removed) ?? false;

export const useMentionDeleted = (id: number): boolean =>
  useInboxStore((state) => state.mentions.get(id)?.comment.deleted) ?? false;

export const useMentionCreator = (id: number): Person | undefined =>
  useInboxStore((state) => state.mentions.get(id)?.creator);

export const useMentionCreatorAvatar = (id: number): string | undefined =>
  useInboxStore((state) => state.mentions.get(id)?.creator.avatar);

export const useMentionCreatorName = (id: number): string | undefined =>
  useInboxStore((state) => state.mentions.get(id)?.creator.name);

export const useMentionCreatorActorId = (id: number): string | undefined =>
  useInboxStore((state) => state.mentions.get(id)?.creator.actor_id);

export const useMentionUpvotes = (id: number): number =>
  useInboxStore((state) => state.mentions.get(id)?.counts.upvotes) ?? 0;

export const useMentionDownvotes = (id: number): number =>
  useInboxStore((state) => state.mentions.get(id)?.counts.downvotes) ?? 0;

export const useMentionScore = (id: number): number =>
  useInboxStore((state) => state.mentions.get(id)?.counts.score) ?? 0;

export const useMentionMyVote = (id: number): number =>
  useInboxStore((state) => state.mentions.get(id)?.my_vote) ?? 0;

export const useMentionRead = (id: number): boolean =>
  useInboxStore((state) => state.mentions.get(id)?.person_mention.read) ??
  false;

export const useMentionPublished = (id: number): string | undefined =>
  useInboxStore((state) => state.mentions.get(id)?.counts.published);

export const useMentionPath = (id: number): string | undefined =>
  useInboxStore((state) => state.mentions.get(id)?.comment.path);

export const useMessageContent = (id: number): string | undefined =>
  useInboxStore(
    (state) => state.privateMessages.get(id)?.private_message.content,
  );

export const useMessageDeleted = (id: number): boolean =>
  useInboxStore(
    (state) => state.privateMessages.get(id)?.private_message.deleted,
  ) ?? false;

export const useMessageCreatorAvatar = (id: number): string | undefined =>
  useInboxStore((state) => state.privateMessages.get(id)?.creator.avatar);

export const useMessageCreatorName = (id: number): string | undefined =>
  useInboxStore((state) => state.privateMessages.get(id)?.creator.name);

export const useMessageCreatorActorId = (id: number): string | undefined =>
  useInboxStore((state) => state.privateMessages.get(id)?.creator.actor_id);
