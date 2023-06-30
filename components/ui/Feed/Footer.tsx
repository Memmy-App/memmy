import React from "react";
import LoadingErrorFooter from "../Loading/LoadingErrorFooter";
import LoadingErrorView from "../Loading/LoadingErrorView";
import LoadingFooter from "../Loading/LoadingFooter";

interface Props {
  loading?: boolean;
  error?: boolean;
  empty?: boolean;
  onRetry: (refresh?: boolean) => void;
}

function Footer({ loading, error, empty, onRetry }: Props) {
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

export default Footer;
