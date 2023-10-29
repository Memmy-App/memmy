import { useDataStore } from '@src/state';
import { CommentReplyView, PersonMentionView } from 'lemmy-js-client';

interface SetReplyReadParams {
  itemId: number;
  type: 'reply' | 'mention';
}

export const setReplyRead = ({ itemId, type }: SetReplyReadParams): void => {
  useDataStore.setState((state) => {
    const reply = state[type === 'reply' ? 'replies' : 'mentions'].get(itemId);

    if (reply == null) return;

    switch (type) {
      case 'reply': {
        (reply as CommentReplyView).comment_reply.read = true;
        break;
      }
      case 'mention': {
        (reply as PersonMentionView).person_mention.read = true;
        break;
      }
    }
  });
};

export const setMessageRead = (messageId: number): void => {
  useDataStore.setState((state) => {
    const reply = state.privateMessages.get(messageId);

    if (reply == null) return;

    reply.private_message.read = true;
  });
};
