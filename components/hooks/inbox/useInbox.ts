import {useState} from "react";
import {CommentReply, CommentReplyView} from "lemmy-js-client";
import {lemmyAuthToken, lemmyInstance} from "../../../lemmy/LemmyInstance";

const useInbox = () => {
  const [replies, setReplies] = useState<CommentReplyView>();

  const doLoadReplies = async () => {
    try {
      const res = lemmyInstance.getReplies({
        auth: lemmyAuthToken,
      })
    }
  };

  const doLoadMentions = () => {

  };

  const doLoadMessage = () => {

  };
};

export default useInbox;
