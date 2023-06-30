import React from "react";
import { useTheme } from "native-base";
import { PostView } from "lemmy-js-client";
import { IconMessages } from "tabler-icons-react-native";
import { ExtensionType, LinkInfo } from "../../../../helpers/LinkHelper";
import { useAppSelector } from "../../../../store";
import { selectSettings } from "../../../../slices/settings/settingsSlice";
import LinkPreviewThumbnail from "./CompactThumbnailTypes/LinkPreviewThumbnail";
import ImageThumbnail from "./CompactThumbnailTypes/ImageThumbnail";
import ThumbnailBox from "./CompactThumbnailTypes/CompactThumbnailBox";
import LinkWithThumbnail from "./CompactThumbnailTypes/LinkWithThumbnail";

function CompactFeedItemThumbnail({
  post,
  linkInfo,
  setImageViewOpen,
  imageViewOpen,
  setPostRead,
}: {
  post: PostView;
  linkInfo: LinkInfo;
  setImageViewOpen: (open: boolean) => void;
  imageViewOpen: boolean;
  setPostRead: () => void;
}) {
  const { colors } = useTheme();
  const { blurNsfw, markReadOnPostImageView } = useAppSelector(selectSettings);

  if (linkInfo.extType === ExtensionType.IMAGE) {
    return (
      <ImageThumbnail
        post={post}
        setImageViewOpen={setImageViewOpen}
        imageViewOpen={imageViewOpen}
        setPostRead={setPostRead}
        blurNsfw={blurNsfw}
        markReadOnPostImageView={markReadOnPostImageView}
      />
    );
  }

  if (post.post.thumbnail_url) {
    return <LinkWithThumbnail post={post} />;
  }

  if (linkInfo.extType !== ExtensionType.NONE) {
    return <LinkPreviewThumbnail linkInfo={linkInfo} />;
  }

  return (
    <ThumbnailBox>
      <IconMessages size={40} color={colors.app.textSecondary} />
    </ThumbnailBox>
  );
}

export default CompactFeedItemThumbnail;
