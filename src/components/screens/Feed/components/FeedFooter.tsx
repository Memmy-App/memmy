import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRoute } from "@react-navigation/core";
import LoadingFooter from "../../../common/Loading/LoadingFooter";
import LoadingErrorView from "../../../common/Loading/LoadingErrorView";
import LoadingErrorFooter from "../../../common/Loading/LoadingErrorFooter";
import {
  useFeedPosts,
  useFeedStatus,
} from "../../../../stores/feeds/feedsStore";
import loadFeedPosts from "../../../../stores/feeds/actions/loadFeedPosts";

function FeedFooter() {
  const { key } = useRoute();
  const status = useFeedStatus(key);
  const posts = useFeedPosts(key);

  const { t } = useTranslation();

  const onRetry = useCallback(() => {
    loadFeedPosts(key, { refresh: true });
  }, []);

  const onLoad = useCallback(() => {
    loadFeedPosts(key, { refresh: false });
  }, []);

  if (status?.loading) {
    return <LoadingFooter message={t("feed.footer.loading")} />;
  }

  if (status?.error) {
    return posts.length < 1 ? (
      <LoadingErrorView onRetryPress={onRetry} />
    ) : (
      <LoadingErrorFooter
        onRetryPress={onLoad}
        message={t("feed.footer.loadingError")}
      />
    );
  }

  return null;
}

export default FeedFooter;
