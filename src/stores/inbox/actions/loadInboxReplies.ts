import { useInboxStore } from "../inboxStore";
import { lemmyAuthToken, lemmyInstance } from "../../../LemmyInstance";
import ILemmyComment from "../../../types/lemmy/ILemmyComment";
import { ILemmyVote } from "../../../types/lemmy/ILemmyVote";
import { handleLemmyError } from "../../../helpers/LemmyErrorHelper";

const loadInboxReplies = async () => {
  useInboxStore.setState((state) => {
    state.status.loading = true;
    state.status.error = false;
  });

  try {
    const res = await lemmyInstance.getReplies({
      auth: lemmyAuthToken,
      limit: 50,
      unread_only: false,
      sort: "New",
    });

    const betterComments: ILemmyComment[] = [];

    for (const item of res.replies) {
      betterComments.push({
        comment: item,
        hidden: false,
        collapsed: false,
        myVote: item.my_vote as ILemmyVote,
      });
    }

    useInboxStore.setState((state) => {
      state.status.loading = false;
      state.replies = betterComments;
    });
  } catch (e) {
    handleLemmyError(e.toString());

    useInboxStore.setState((state) => {
      state.status.loading = false;
      state.status.error = true;
    });
  }
};

export default loadInboxReplies;
