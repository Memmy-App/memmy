import React from "react";
import { useTranslation } from "react-i18next";
import LoadingFooter from "../../../common/Loading/LoadingFooter";
import LoadingErrorView from "../../../common/Loading/LoadingErrorView";
import LoadingErrorFooter from "../../../common/Loading/LoadingErrorFooter";

interface Props {
  loading?: boolean;
  error?: boolean;
  empty?: boolean;
  onRetry: (refresh?: boolean) => void;
}

function FeedFooter({ loading, error, empty, onRetry }: Props) {
  const { t } = useTranslation();

  if (loading) {
    return <LoadingFooter message={t("feed.footer.loading")} />;
  }

  if (error) {
    return empty ? (
      <LoadingErrorView onRetryPress={onRetry} />
    ) : (
      <LoadingErrorFooter
        onRetryPress={() => onRetry(true)}
        message={t("feed.footer.loadingError")}
      />
    );
  }

  return null;
}

export default FeedFooter;
