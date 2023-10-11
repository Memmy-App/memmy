import {
  CommentView,
  Person,
  Post,
  PostAggregates,
  PostView,
} from 'lemmy-js-client';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

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

export const usePostCounts = (id: number): PostAggregates | undefined =>
  usePostStore((state) => state.posts.get(id))?.view.counts;

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

export const usePostCommunityName = (id: number): string | undefined =>
  usePostStore((state) => state.posts.get(id))?.view.community.name;

export const usePostCommunityActorId = (id: number): string | undefined =>
  usePostStore((state) => state.posts.get(id))?.view.community.actor_id;

export const usePostCommunityIcon = (id: number): string | undefined =>
  usePostStore((state) => state.posts.get(id))?.view.community.icon;

export const usePostMyVote = (id: number): number | undefined =>
  usePostStore((state) => state.posts.get(id))?.view.my_vote;

export const usePostSaved = (id: number): boolean =>
  usePostStore((state) => state.posts.get(id))?.view.saved ?? false;
