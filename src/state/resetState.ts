import { useAppStore } from '@src/state/app';
import { useDataStore } from '@src/state/data';

export const resetState = (): void => {
  useAppStore.setState((state) => {
    state.newPostId = undefined;
    state.newCommentId = undefined;
    state.lastFeedPress = 0;
    state.toast = null;
    state.drawerOpen = false;
    state.unread = 0;
  });

  useDataStore.setState((state) => {
    state.comments.clear();
    state.postComments.clear();
    state.communities.clear();
    state.feeds.clear();
    state.privateMessages.clear();
    state.privateMessageIds = [];
    state.replies.clear();
    state.replyIds = [];
    state.mentions.clear();
    state.mentionIds = [];
    state.profiles.clear();
    state.posts.clear();
    state.site.site = undefined;
    state.site.subscriptions = [];
    state.site.moderated = [];
    state.site.moderatedIds = [];
  });
};
