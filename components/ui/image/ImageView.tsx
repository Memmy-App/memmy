import React from "react";
import { ImageDetail } from "@dreamwalk-os/react-native-image-modal";
import { Dimensions, Share } from "react-native";
import { useToast } from "native-base";
import ImageViewFooter from "./ImageViewFooter";
import downloadAndSaveImage from "../../../helpers/ImageHelper";

interface ImageViewProps {
  source: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
}

function ImageView({ source, setIsOpen, isOpen }: ImageViewProps) {
  const toast = useToast();

  const onClose = () => {
    setIsOpen(false);
  };

  const onSave = () => {
    toast.show({
      title: "Image saved",
      duration: 3000,
    });

    downloadAndSaveImage(source);
  };
  const onShare = () => {
    Share.share({
      url: source,
    });
  };

  return (
    <ImageDetail
      isOpen={isOpen}
      origin={{
        x: Dimensions.get("window").width / 2,
        y: Dimensions.get("window").height / 2,
        width: 100,
        height: 100,
      }}
      source={{
        uri: source,
      }}
      onClose={onClose}
      swipeToDismiss
      renderFooter={() => <ImageViewFooter onSave={onSave} onShare={onShare} />}
      resizeMode="contain"
      backgroundColor="#000"
    />
  );
}

export default ImageView;
