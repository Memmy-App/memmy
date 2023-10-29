import { PostState } from '@src/state/data/post';
import { CommentState } from '@src/state/data/comment';
import {
  CommentReplyView,
  GetCommunityResponse,
  GetPersonDetailsResponse,
  PersonMentionView,
  PrivateMessageView,
} from 'lemmy-js-client';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { FeedState } from '@src/state/data/feed';
import { SiteState } from '@src/state';

interface DataStore {
  // Map of all loaded posts
  posts: Map<number, PostState>;
  // Map of all comments
  comments: Map<number, CommentState>;
  // Map with a key of a post ID and a value of an array of comment IDs. Useful for cleanup
  postComments: Map<number, number[]>;
  // Map of loaded communities by ID. Is not actually a community view by itself but a GetCommunityResponse so that we
  // can access things like the moderator list
  communities: Map<number, GetCommunityResponse>;
  // Map of all replies
  replies: Map<number, CommentReplyView>;
  // Map of all mentions
  mentions: Map<number, PersonMentionView>;
  // Map of all private messages
  privateMessages: Map<number, PrivateMessageView>;
  // Map of all profiles
  profiles: Map<number, GetPersonDetailsResponse>;
  // Map of all feeds by screen id
  feeds: Map<string, FeedState>;
  site?: SiteState;
}

export const useDataStore = create(
  immer<DataStore>(() => ({
    posts: new Map(),
    comments: new Map(),
    postComments: new Map(),
    communities: new Map(),
    replies: new Map(),
    mentions: new Map(),
    privateMessages: new Map(),
    profiles: new Map(),
    feeds: new Map(),
    site: undefined,
  })),
);
