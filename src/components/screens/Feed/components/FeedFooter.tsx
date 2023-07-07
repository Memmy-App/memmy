import React from "react";
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
  if (loading) {
    return <LoadingFooter message="Loading more posts..." />;
  }

  if (error) {
    return empty ? (
      <LoadingErrorView onRetryPress={onRetry} />
    ) : (
      <LoadingErrorFooter
        onRetryPress={() => onRetry(true)}
        message="Failed to load posts :("
      />
    );
  }

  return null;
}

export default FeedFooter;
