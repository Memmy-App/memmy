import React from "react";
import { useTranslation } from "react-i18next";
import { useRoute } from "@react-navigation/core";
import LoadingFooter from "../../../common/Loading/LoadingFooter";
import LoadingErrorFooter from "../../../common/Loading/LoadingErrorFooter";
import { useFeedStatus } from "../../../../stores/feeds/feedsStore";
import loadFeedPosts from "../../../../stores/feeds/actions/loadFeedPosts";

function FeedFooter() {
  const { key } = useRoute();
  const status = useFeedStatus(key);

  const { t } = useTranslation();

  const onLoad = () => {
    loadFeedPosts(key, { refresh: false }).then();
  };

  if (status?.loading) {
    return <LoadingFooter message={t("feed.footer.loading")} />;
  }

  if (status?.error) {
    return (
      <LoadingErrorFooter
        onRetryPress={onLoad}
        message={t("feed.footer.loadingError")}
      />
    );
  }

  return null;
}

export default FeedFooter;
