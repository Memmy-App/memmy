import React from "react";
import { ExtensionType, LinkInfo } from "../../../helpers/LinkHelper";
import { MediaProps } from "./common";
import ImageViewer from "./ImageViewer/ImageViewer";

type IProps = Omit<MediaProps, "source"> & {
  media: LinkInfo;
};

function MediaViewer({ media, ...props }: IProps) {
  if (media.extType === ExtensionType.IMAGE) {
    return <ImageViewer source={media.link} {...props} />;
  } else if (media.extType === ExtensionType.VIDEO) {
    return <ImageViewer source={media.link} {...props} />;
  }

  return <></>; // should reutn maybe something that indicates an error to the user
}

export default MediaViewer;
