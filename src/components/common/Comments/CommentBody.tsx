import React from "react";
import { useTranslation } from "react-i18next";
import RenderMarkdown from "../Markdown/RenderMarkdown";
import ItalicText from "../ItalicText";

interface IProps {
  deleted: boolean;
  removed: boolean;
  content: string;
}

function CommentBody({ deleted, removed, content }: IProps) {
  const { t } = useTranslation();

  if (deleted) {
    return <ItalicText>{t("comment.deletedByUser")}</ItalicText>;
  }

  if (removed) {
    return <ItalicText>{t("comment.removedByMod")}</ItalicText>;
  }

  return <RenderMarkdown text={content} addImages imageSize={30} />;
}

export default React.memo(CommentBody);
