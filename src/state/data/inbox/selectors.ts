import { useDataStore } from '@src/state';
import { Person, PersonMentionView } from 'lemmy-js-client';

// export const usePrivateMessages = (): number[] =>
//   useDataStore((state) => state.privateMessageIds);
// export const useReplies = (): number[] =>
//   useDataStore((state) => state.replyIds);
// export const useMentions = (): number[] =>
//   useDataStore((state) => state.mentionIds);

export const useMention = (id: number): PersonMentionView | undefined =>
  useDataStore((state) => state.mentions.get(id));

export const useReplyPostId = (id: number): number | undefined =>
  useDataStore((state) => state.replies.get(id)?.post.id);

export const useReplyCommentId = (id: number): number | undefined =>
  useDataStore((state) => state.replies.get(id)?.comment.id);

export const useReplyContent = (id: number): string | undefined =>
  useDataStore((state) => state.replies.get(id)?.comment.content);

export const useReplyRemoved = (id: number): boolean =>
  useDataStore((state) => state.replies.get(id)?.comment.removed) ?? false;

export const useReplyDeleted = (id: number): boolean =>
  useDataStore((state) => state.replies.get(id)?.comment.deleted) ?? false;

export const useReplyCreator = (id: number): Person | undefined =>
  useDataStore((state) => state.replies.get(id)?.creator);

export const useReplyUpvotes = (id: number): number =>
  useDataStore((state) => state.replies.get(id)?.counts.upvotes) ?? 0;

export const useReplyDownvotes = (id: number): number =>
  useDataStore((state) => state.replies.get(id)?.counts.downvotes) ?? 0;

export const useReplyScore = (id: number): number =>
  useDataStore((state) => state.replies.get(id)?.counts.score) ?? 0;

export const useReplyMyVote = (id: number): number =>
  useDataStore((state) => state.replies.get(id)?.my_vote) ?? 0;

export const useReplyRead = (id: number): boolean =>
  useDataStore((state) => state.replies.get(id)?.comment_reply.read) ?? false;

export const useReplyPath = (id: number): string | undefined =>
  useDataStore((state) => state.replies.get(id)?.comment.path);

export const useReplyPublished = (id: number): string | undefined =>
  useDataStore((state) => state.replies.get(id)?.counts.published);

export const useMentionPostId = (id: number): number | undefined =>
  useDataStore((state) => state.mentions.get(id)?.post.id);

export const useMentionCommentId = (id: number): number | undefined =>
  useDataStore((state) => state.mentions.get(id)?.comment.id);

export const useMentionContent = (id: number): string | undefined =>
  useDataStore((state) => state.mentions.get(id)?.comment.content);

export const useMentionRemoved = (id: number): boolean =>
  useDataStore((state) => state.mentions.get(id)?.comment.removed) ?? false;

export const useMentionDeleted = (id: number): boolean =>
  useDataStore((state) => state.mentions.get(id)?.comment.deleted) ?? false;

export const useMentionCreator = (id: number): Person | undefined =>
  useDataStore((state) => state.mentions.get(id)?.creator);

export const useMentionUpvotes = (id: number): number =>
  useDataStore((state) => state.mentions.get(id)?.counts.upvotes) ?? 0;

export const useMentionDownvotes = (id: number): number =>
  useDataStore((state) => state.mentions.get(id)?.counts.downvotes) ?? 0;

export const useMentionScore = (id: number): number =>
  useDataStore((state) => state.mentions.get(id)?.counts.score) ?? 0;

export const useMentionMyVote = (id: number): number =>
  useDataStore((state) => state.mentions.get(id)?.my_vote) ?? 0;

export const useMentionRead = (id: number): boolean =>
  useDataStore((state) => state.mentions.get(id)?.person_mention.read) ?? false;

export const useMentionPublished = (id: number): string | undefined =>
  useDataStore((state) => state.mentions.get(id)?.counts.published);

export const useMentionPath = (id: number): string | undefined =>
  useDataStore((state) => state.mentions.get(id)?.comment.path);

export const useMessageContent = (id: number): string | undefined =>
  useDataStore(
    (state) => state.privateMessages.get(id)?.private_message.content,
  );

export const useMessageDeleted = (id: number): boolean =>
  useDataStore(
    (state) => state.privateMessages.get(id)?.private_message.deleted,
  ) ?? false;

export const useMessageCreatorAvatar = (id: number): string | undefined =>
  useDataStore((state) => state.privateMessages.get(id)?.creator.avatar);

export const useMessageCreatorName = (id: number): string | undefined =>
  useDataStore((state) => state.privateMessages.get(id)?.creator.name);

export const useMessageCreatorActorId = (id: number): string | undefined =>
  useDataStore((state) => state.privateMessages.get(id)?.creator.actor_id);
