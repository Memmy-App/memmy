import React from "react";
import { Dimensions, Share } from "react-native";
import { useToast } from "native-base";
import ImageViewFooter from "./ImageViewFooter";
import downloadAndSaveImage from "../../../helpers/ImageHelper";
import ImageModal from "./ImageModal";

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
    <ImageModal
      source={source}
      onRequestClose={() => setIsOpen(false)}
      isOpen={isOpen}
      width={Dimensions.get("screen").width}
      height={Dimensions.get("screen").height}
      // renderFooter={() => (
      //   <ImageViewFooter onShare={onShare} onSave={onSave} />
      // )}
    />
  );
}

export default ImageView;
