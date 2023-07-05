import React from "react";
import ItalicText from "../common/ItalicText";
import RenderMarkdown from "../markdown/RenderMarkdown";

interface IProps {
  deleted: boolean;
  removed: boolean;
  content: string;
}

function CommentBody({ deleted, removed, content }: IProps) {
  if (deleted) {
    return <ItalicText>Comment removed by user :(</ItalicText>;
  }

  if (removed) {
    return <ItalicText>Comment removed by moderator :(</ItalicText>;
  }

  return <RenderMarkdown text={content} />;
}

export default React.memo(CommentBody);
