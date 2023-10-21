import {
  CommentReplyView,
  PersonMentionView,
  PrivateMessageView,
} from 'lemmy-js-client';
import { useInboxStore } from '@src/state';

export const setReplies = (replies: CommentReplyView[]): void => {
  const replyIds: number[] = [];

  useInboxStore.setState((state) => {
    for (let i = 0; i < replies.length; i++) {
      const reply = replies[i];

      replyIds.push(reply.comment_reply.id);
      state.replies.set(reply.comment_reply.id, reply);
    }

    state.replyIds = replyIds;
  });
};

export const setMentions = (mentions: PersonMentionView[]): void => {
  const mentionIds: number[] = [];

  useInboxStore.setState((state) => {
    for (let i = 0; i < mentions.length; i++) {
      const mention = mentions[i];

      mentionIds.push(mention.person_mention.id);
      state.mentions.set(mention.person_mention.id, mention);
    }

    state.replyIds = mentionIds;
  });
};

export const setPrivateMessages = (messages: PrivateMessageView[]): void => {
  const messageIds: number[] = [];

  useInboxStore.setState((state) => {
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];

      messageIds.push(message.private_message.id);
      state.privateMessages.set(message.private_message.id, message);
    }

    state.replyIds = messageIds;
  });
};
