import { useDataStore } from '@src/state/data';
import { Person } from 'lemmy-js-client';

export const useCommentCreatorActorId = (id: number): string | undefined =>
  useDataStore((state) => state.comments.get(id)?.view.creator.actor_id);

export const useCommentContent = (id: number): string | undefined =>
  useDataStore((state) => state.comments.get(id)?.view.comment.content);

export const useCommentPath = (id: number): string | undefined =>
  useDataStore((state) => state.comments.get(id)?.view.comment.path);

export const useCommentUpvotes = (id: number): number | undefined =>
  useDataStore((state) => state.comments.get(id)?.view.counts.upvotes);

export const useCommentDownvotes = (id: number): number | undefined =>
  useDataStore((state) => state.comments.get(id)?.view.counts.downvotes);

export const useCommentScore = (id: number): number | undefined =>
  useDataStore((state) => state.comments.get(id)?.view.counts.score);

export const useCommentSaved = (id: number): boolean =>
  useDataStore((state) => state.comments.get(id)?.view.saved ?? false);

export const useCommentMyVote = (id: number): number | undefined =>
  useDataStore((state) => state.comments.get(id)?.view.my_vote);

export const useCommentPostId = (id: number): number | undefined =>
  useDataStore((state) => state.comments.get(id)?.view.post.id);

export const useCommentIsOwnComment = (id: number): boolean =>
  useDataStore((state) => state.comments.get(id)?.isOwnComment ?? false);

export const useCommentModerates = (id: number): boolean =>
  useDataStore((state) => state.comments.get(id)?.moderates ?? false);

export const useCommentDeleted = (id: number): boolean =>
  useDataStore(
    (state) => state.comments.get(id)?.view.comment.deleted ?? false,
  );

export const useCommentRemoved = (id: number): boolean =>
  useDataStore(
    (state) => state.comments.get(id)?.view.comment.removed ?? false,
  );

export const useCommentPublished = (id: number): string | undefined =>
  useDataStore((state) => state.comments.get(id)?.view.comment.published);

export const useCommentCreator = (id: number): Person | undefined =>
  useDataStore((state) => state.comments.get(id)?.view.creator);
