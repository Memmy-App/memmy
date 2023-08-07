import React from "react";
import { useTranslation } from "react-i18next";
import RenderMarkdown from "../Markdown/RenderMarkdown";
import ItalicText from "../ItalicText";
import { Box } from "../Gluestack";

interface IProps {
  deleted: boolean;
  removed: boolean;
  content: string;
  instance: string;
}

function CommentBody({ deleted, removed, content, instance }: IProps) {
  const { t } = useTranslation();
  if (deleted) {
    return <ItalicText>{t("comment.deletedByUser")}</ItalicText>;
  }

  if (removed) {
    return <ItalicText>{t("comment.removedByMod")}</ItalicText>;
  }

  return (
    <Box mt={-5}>
      <RenderMarkdown text={content} instance={instance} />
    </Box>
  );
}

export default React.memo(CommentBody);
