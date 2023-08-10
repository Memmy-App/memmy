import React from "react";
import { useRoute } from "@react-navigation/core";
import { useFeedPostCommunity } from "@src/state/feed/feedStore";
import { FeedItemContextMenu } from "@src/components/contextMenus/feed/FeedItemContextMenu";
import { View, VStack } from "@src/components/gluestack";
import { useThemeOptions } from "@src/state/settings/settingsStore";
import { FeedItemHeader } from "@src/components/screens/Feed/components/FeedItem/FeedItemHeader";
import { FeedItemWrapper } from "@src/components/screens/Feed/components/FeedItem/FeedItemWrapper";
import { StyleSheet } from "react-native";
import FastImage from "@gkasdorf/react-native-fast-image";
import { FeedItemContent } from "@src/components/screens/Feed/components/FeedItem/FeedItemContent";

interface IProps {
  postId: number;
  recycled: React.MutableRefObject<{}>;
}

function Item({ postId, recycled }: IProps): React.JSX.Element {
  const { key } = useRoute();

  const theme = useThemeOptions();

  const postCommunity = useFeedPostCommunity(key, postId);

  return (
    <FeedItemContextMenu postId={postId}>
      <FeedItemWrapper postId={postId}>
        <VStack backgroundColor={theme.colors.fg}>
          <FeedItemHeader postId={postId} />
          <View style={styles.community}>
            {postCommunity?.icon && (
              <FastImage source={{ uri: postCommunity.icon }} />
            )}
          </View>
          <FeedItemContent postId={postId} recycled={recycled} />
        </VStack>
      </FeedItemWrapper>
    </FeedItemContextMenu>
  );
}

const styles = StyleSheet.create({
  community: {
    flexDirection: "row",
  },

  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    flexDirection: "row",
  },

  backgroundLeft: {
    flex: 1,
  },

  backgroundRight: {
    flex: 1,
  },
});

export const FeedItem = React.memo(Item);
