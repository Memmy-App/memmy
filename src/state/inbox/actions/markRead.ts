import { useInboxStore } from '@src/state';

export const setReplyRead = (replyId: number): void => {
  useInboxStore.setState((state) => {
    const reply = state.replies.get(replyId);

    if (reply == null) return;

    reply.comment_reply.read = true;
  });
};

export const setMentionRead = (mentionId: number): void => {
  useInboxStore.setState((state) => {
    const reply = state.mentions.get(mentionId);

    if (reply == null) return;

    reply.person_mention.read = true;
  });
};

export const setMessageRead = (messageId: number): void => {
  useInboxStore.setState((state) => {
    const reply = state.privateMessages.get(messageId);

    if (reply == null) return;

    reply.private_message.read = true;
  });
};
