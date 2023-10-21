import { useAppStore } from '@src/state/app';
import { useCommentStore } from '@src/state/comment';
import { useCommunityStore } from '@src/state/community';
import { useFeedStore } from '@src/state/feed';
import { useImageStore } from '@src/state/image';
import { useInboxStore } from '@src/state/inbox';
import { usePostStore } from '@src/state/post';
import { useProfileStore } from '@src/state/profile';
import { useSiteStore } from '@src/state/site';

export const resetState = (): void => {
  useAppStore.setState((state) => {
    state.newPostId = undefined;
    state.newCommentId = undefined;
    state.lastFeedPress = 0;
    state.toast = null;
    state.drawerOpen = false;
    state.unread = 0;
  });

  useCommentStore.setState((state) => {
    state.comments.clear();
    state.postComments.clear();
  });

  useCommunityStore.setState((state) => {
    state.communities.clear();
  });

  useFeedStore.setState((state) => {
    state.feeds.clear();
  });

  useImageStore.setState((state) => {
    state.dimensions.clear();
  });

  useInboxStore.setState((state) => {
    state.privateMessages.clear();
    state.replies.clear();
    state.mentions.clear();

    state.privateMessageIds = [];
    state.replyIds = [];
    state.mentionIds = [];
  });

  usePostStore.setState((state) => {
    state.posts.clear();
  });

  useProfileStore.setState((state) => {
    state.profiles.clear();
  });

  useSiteStore.setState((state) => {
    state.site = undefined;
    state.subscriptions = [];
    state.moderated = [];
    state.moderatedIds = [];
  });
};
