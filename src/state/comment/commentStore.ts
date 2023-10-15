import { CommentView } from 'lemmy-js-client';
import { immer } from 'zustand/middleware/immer';
import { create } from 'zustand';

interface CommentStore {
  comments: Map<number, CommentView>;
  postComments: Map<number, number[]>;
}

export const useCommentStore = create(
  immer<CommentStore>(() => ({
    comments: new Map<number, CommentView>(),
    postComments: new Map<number, number[]>(),
  })),
);

export const useComment = (id: number): CommentView | undefined =>
  useCommentStore((state) => state.comments.get(id));

export const useCommentCreatorAvatar = (id: number): string | undefined =>
  useCommentStore((state) => state.comments.get(id)?.creator.avatar);

export const useCommentCreatorName = (id: number): string | undefined =>
  useCommentStore((state) => state.comments.get(id)?.creator.name);

export const useCommentCreatorId = (id: number): number | undefined =>
  useCommentStore((state) => state.comments.get(id)?.creator.id);

export const useCommentContent = (id: number): string | undefined =>
  useCommentStore((state) => state.comments.get(id)?.comment.content);

export const useCommentPath = (id: number): string | undefined =>
  useCommentStore((state) => state.comments.get(id)?.comment.path);

export const useCommentUpvotes = (id: number): number | undefined =>
  useCommentStore((state) => state.comments.get(id)?.counts.upvotes);

export const useCommentDownvotes = (id: number): number | undefined =>
  useCommentStore((state) => state.comments.get(id)?.counts.downvotes);

export const useCommentScore = (id: number): number | undefined =>
  useCommentStore((state) => state.comments.get(id)?.counts.score);

export const useCommentSaved = (id: number): boolean =>
  useCommentStore((state) => state.comments.get(id)?.saved ?? false);

export const useCommentMyVote = (id: number): number | undefined =>
  useCommentStore((state) => state.comments.get(id)?.my_vote);

export const useCommentPostId = (id: number): number | undefined =>
  useCommentStore((state) => state.comments.get(id)?.post.id);
