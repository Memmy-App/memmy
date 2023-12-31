import {
  CommentReplyView,
  PersonMentionView,
  PrivateMessageView,
} from 'lemmy-js-client';
import { useDataStore } from '@src/state';

export const setAllRepliesRead = (): void => {
  useDataStore.setState((state) => {
    state.replies.forEach((c) => {
      c.comment_reply.read = true;
    });
    state.mentions.forEach((c) => {
      c.person_mention.read = true;
    });
    state.privateMessages.forEach((c) => {
      c.private_message.read = true;
    });
  });
};

interface AddRepliesParams {
  replies: CommentReplyView[] | PersonMentionView[] | PrivateMessageView[];
  type: 'reply' | 'mention' | 'message';
}

export const addReplies = ({ replies, type }: AddRepliesParams): void => {
  useDataStore.setState((state) => {
    const ids = [];

    for (let i = 0; i < replies.length; i++) {
      const reply = replies[i];

      switch (type) {
        case 'reply': {
          const r = reply as CommentReplyView;
          state.replies.set(r.comment_reply.id, r);
          ids.push(r.comment_reply.id);
          break;
        }
        case 'mention': {
          const r = reply as PersonMentionView;
          state.mentions.set(r.person_mention.id, r);
          ids.push(r.person_mention.id);
          break;
        }
        case 'message': {
          const r = reply as PrivateMessageView;
          state.privateMessages.set(r.private_message.id, r);
          ids.push(r.private_message.id);
          break;
        }
      }
    }

    switch (type) {
      case 'reply': {
        state.replyIds = ids;
        break;
      }
      case 'mention': {
        state.mentionIds = ids;
        break;
      }
      case 'message': {
        state.privateMessageIds = ids;
        break;
      }
    }
  });
};
