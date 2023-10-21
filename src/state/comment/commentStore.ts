import { CommentView } from 'lemmy-js-client';
import { immer } from 'zustand/middleware/immer';
import { create } from 'zustand';

interface CommentState {
  view: CommentView;
  moderates: boolean;
  isOwnComment: boolean;
}

interface CommentStore {
  comments: Map<number, CommentState>;
  postComments: Map<number, number[]>;
}

export const useCommentStore = create(
  immer<CommentStore>(() => ({
    comments: new Map<number, CommentState>(),
    postComments: new Map<number, number[]>(),
  })),
);

export const useComment = (id: number): CommentView | undefined =>
  useCommentStore((state) => state.comments.get(id)?.view);

export const useCommentCreatorAvatar = (id: number): string | undefined =>
  useCommentStore((state) => state.comments.get(id)?.view.creator.avatar);

export const useCommentCreatorName = (id: number): string | undefined =>
  useCommentStore((state) => state.comments.get(id)?.view.creator.name);

export const useCommentCreatorId = (id: number): number | undefined =>
  useCommentStore((state) => state.comments.get(id)?.view.creator.id);

export const useCommentCreatorActorId = (id: number): string | undefined =>
  useCommentStore((state) => state.comments.get(id)?.view.creator.actor_id);

export const useCommentContent = (id: number): string | undefined =>
  useCommentStore((state) => state.comments.get(id)?.view.comment.content);

export const useCommentPath = (id: number): string | undefined =>
  useCommentStore((state) => state.comments.get(id)?.view.comment.path);

export const useCommentUpvotes = (id: number): number | undefined =>
  useCommentStore((state) => state.comments.get(id)?.view.counts.upvotes);

export const useCommentDownvotes = (id: number): number | undefined =>
  useCommentStore((state) => state.comments.get(id)?.view.counts.downvotes);

export const useCommentScore = (id: number): number | undefined =>
  useCommentStore((state) => state.comments.get(id)?.view.counts.score);

export const useCommentSaved = (id: number): boolean =>
  useCommentStore((state) => state.comments.get(id)?.view.saved ?? false);

export const useCommentMyVote = (id: number): number | undefined =>
  useCommentStore((state) => state.comments.get(id)?.view.my_vote);

export const useCommentPostId = (id: number): number | undefined =>
  useCommentStore((state) => state.comments.get(id)?.view.post.id);

export const useCommentIsOwnComment = (id: number): boolean =>
  useCommentStore((state) => state.comments.get(id)?.isOwnComment ?? false);

export const useCommentModerates = (id: number): boolean =>
  useCommentStore((state) => state.comments.get(id)?.moderates ?? false);

export const useCommentCommunityId = (id: number): number | undefined =>
  useCommentStore((state) => state.comments.get(id)?.view.post.community_id);

export const useCommentDeleted = (id: number): boolean =>
  useCommentStore(
    (state) => state.comments.get(id)?.view.comment.deleted ?? false,
  );

export const useCommentRemoved = (id: number): boolean =>
  useCommentStore(
    (state) => state.comments.get(id)?.view.comment.removed ?? false,
  );

export const useCommentActorId = (id: number): string | undefined =>
  useCommentStore((state) => state.comments.get(id)?.view.comment.ap_id);
