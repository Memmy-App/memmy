import { Box, HStack, Text } from "@src/components/common/Gluestack";
import React from "react";
import { Dimensions } from "react-native";
import { LinkInfo } from "../../../helpers/LinkHelper";
import MediaViewer from "./MediaViewer";

interface IProps {
  images: LinkInfo[];
  postId: number;
  isNsfw: boolean;
  recycled?: React.MutableRefObject<{}>;
  setPostRead?: () => void;
}

function MediaPreview({
  images,
  postId,
  recycled,
  isNsfw,
  setPostRead,
}: IProps) {
  if (images.length === 1) {
    return (
      <MediaViewer
        media={images[0]}
        nsfw={isNsfw}
        postId={postId}
        recycled={recycled}
        setPostRead={setPostRead}
      />
    );
  }

  if (images.length >= 2 && images[0] !== images[1]) {
    return (
      <HStack space="xs">
        <MediaViewer
          media={images[0]}
          nsfw={isNsfw}
          postId={postId}
          recycled={recycled}
          heightOverride={200}
          widthOverride={Dimensions.get("screen").width / 2}
          setPostRead={setPostRead}
        />
        <MediaViewer
          media={images[1]}
          nsfw={isNsfw}
          postId={postId}
          recycled={recycled}
          heightOverride={200}
          widthOverride={Dimensions.get("screen").width / 2}
          setPostRead={setPostRead}
        />
        <Box position="absolute" right="$1" bottom="$1">
          <Box px="$1" m="$0.5" backgroundColor="gray700" borderRadius="$md">
            <Text size="2xs">{images.length} IMAGES</Text>
          </Box>
        </Box>
      </HStack>
    );
  }

  return null;
}

export default MediaPreview;
