import { HStack } from "native-base";
import AvatarUsername from "../../common/AvatarUsername";
import FeaturedIndicator from "../../common/FeaturedIndicator";
import { Person, PostView } from "lemmy-js-client";

interface Props {
  post: PostView;
}

export const ByLine = ({ post }: Props) => {
  return (
    <HStack space={2}>
      <AvatarUsername creator={post.creator} />
      <FeaturedIndicator post={post} />
    </HStack>
  );
};
