import { CommentView, Person, Post, PostView } from 'lemmy-js-client';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { getBaseUrl } from '@helpers/links';

export interface PostState {
  view: PostView;
  comments: CommentView[];
  usedBy: string[];
}

export interface PostStore {
  posts: Map<number, PostState>;
}

export const usePostStore = create(
  immer<PostStore>(() => ({
    posts: new Map<number, PostState>(),
  })),
);

export const usePostView = (id: number): PostView | undefined =>
  usePostStore((state) => state.posts.get(id))?.view;

export const usePostComments = (id: number): CommentView[] =>
  usePostStore((state) => state.posts.get(id))?.comments ?? [];

export const usePost = (id: number): Post | undefined =>
  usePostStore((state) => state.posts.get(id))?.view.post;

interface IUsePostVotes {
  upvotes: number | undefined;
  downvotes: number | undefined;
  score: number | undefined;
}

export const usePostVotes = (id: number): IUsePostVotes =>
  usePostStore((state) => {
    const post = state.posts.get(id);

    return {
      upvotes: post?.view.counts.upvotes,
      downvotes: post?.view.counts.downvotes,
      score: post?.view.counts.score,
    };
  });

export const usePostRead = (id: number): boolean =>
  usePostStore((state) => state.posts.get(id))?.view.read ?? false;

export const usePostCreator = (id: number): Person | undefined =>
  usePostStore((state) => state.posts.get(id))?.view.creator;

export const usePostCommentCount = (id: number): number | undefined =>
  usePostStore((state) => state.posts.get(id))?.view.counts.comments;

export const usePostTitle = (id: number): string | undefined =>
  usePostStore((state) => state.posts.get(id))?.view.post.name;

export interface IPostCommunityName {
  community: string | undefined;
  instance: string | undefined;
}

export const usePostCommunityName = (
  id: number,
): IPostCommunityName | undefined =>
  usePostStore((state) => {
    const post = state.posts.get(id);

    return {
      community: post?.view.community.name,
      instance: getBaseUrl(post?.view.community.actor_id),
    };
  });

export const usePostCommunityIcon = (id: number): string | undefined =>
  usePostStore((state) => state.posts.get(id))?.view.community.icon;
