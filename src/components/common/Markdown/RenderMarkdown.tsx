/* eslint-disable react/no-unstable-nested-components */
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Markdown, { MarkdownIt } from "@ronradtke/react-native-markdown-display";
import {
  ChevronRightIcon,
  HStack,
  Spacer,
  Text,
  useTheme,
  VStack,
} from "native-base";
import React from "react";
import { Pressable, TextStyle, useWindowDimensions } from "react-native";
import FastImage from "react-native-fast-image";
import { useAppSelector } from "../../../../store";
import { openLink } from "../../../helpers/LinkHelper";
import { truncateImageLink } from "../../../helpers/TextHelper";
import { selectCurrentAccount } from "../../../slices/accounts/accountsSlice";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import { fontSizeMap } from "../../../theme/fontSize";
import ImageViewer from "../ImageViewer/ImageViewer";
import ImageButton from "../Buttons/ImageButton";

// const FONT_SIZE = 14;
// const HEADING_1_SIZE = 32;
// const HEADING_2_SIZE = 26;
// const HEADING_3_SIZE = 22;
// const HEADING_4_SIZE = 18;

interface MarkdownProps {
  text: string;
  addImages?: boolean;
  truncate?: boolean;
  isNote?: boolean;
  imageSize?: number;
}

function RenderMarkdown({
  text,
  addImages = false,
  truncate = false,
  isNote = false,
  imageSize,
}: MarkdownProps) {
  const currentAccount = useAppSelector(selectCurrentAccount);
  const { fontSize, isSystemTextSize } = useAppSelector(selectSettings);

  const [imgSrc, setImgSrc] = React.useState("");
  const [visible, setVisible] = React.useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const { fontScale } = useWindowDimensions();
  const fontModifier = fontSizeMap[fontSize];
  const FONT_SIZE = isSystemTextSize ? 14 / fontScale : 15 + fontModifier;
  const HEADING_1_SIZE = isSystemTextSize ? 32 / fontScale : 15 + fontModifier;
  const HEADING_2_SIZE = isSystemTextSize ? 26 / fontScale : 15 + fontModifier;
  const HEADING_3_SIZE = isSystemTextSize ? 22 / fontScale : 15 + fontModifier;
  const HEADING_4_SIZE = isSystemTextSize ? 18 / fontScale : 15 + fontModifier;

  const onLinkPress = (url): boolean => {
    openLink(url, navigation);
    return false;
  };

  const theme = useTheme();

  const fontColor = truncate
    ? theme.colors.app.textSecondary
    : theme.colors.app.textPrimary;

  const styles: Record<string, TextStyle> = {
    span: {
      fontSize: FONT_SIZE,
      color: fontColor,
    },
    inline: {
      fontSize: FONT_SIZE,
      color: fontColor,
    },
    paragraph: {
      fontSize: FONT_SIZE,
      color: isNote ? theme.colors.app.textSecondary : fontColor,
      fontStyle: isNote ? "italic" : "normal",
    },
    heading1: {
      fontSize: HEADING_1_SIZE,
      fontWeight: "bold",
      color: fontColor,
    },
    heading2: {
      fontSize: HEADING_2_SIZE,
      fontWeight: "bold",
      color: fontColor,
    },
    heading3: {
      fontSize: HEADING_3_SIZE,
      fontWeight: "bold",
      color: fontColor,
    },
    heading4: {
      fontSize: HEADING_4_SIZE,
      fontWeight: "bold",
      color: fontColor,
    },
    blockquote: {
      backgroundColor: theme.colors.app.bg,
      borderRadius: 5,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.app.accent,
      marginVertical: 10,
    },
    code_inline: {
      fontSize: FONT_SIZE,
      color: fontColor,
      backgroundColor: theme.colors.app.bg,
    },
    code_block: {
      fontSize: FONT_SIZE,
      color: fontColor,
      backgroundColor: theme.colors.app.bg,
      borderRadius: 5,
    },
    pre: {
      fontSize: FONT_SIZE,
      color: fontColor,
      backgroundColor: theme.colors.app.bg,
      borderRadius: 5,
    },
    image: {},
    link: {
      color: "rgba(0,176,255,0.63)",
      fontSize: FONT_SIZE,
    },
    table: {
      color: fontColor,
      fontSize: FONT_SIZE,
      borderColor: theme.colors.app.border,
      marginVertical: 10,
    },
    th: {
      borderColor: theme.colors.app.border,
      padding: 8,
      fontWeight: "bold",
    },
    td: {
      borderColor: theme.colors.app.border,
      padding: 8,
    },
    tr: {
      borderColor: theme.colors.app.border,
    },
    list_item: {
      color: fontColor,
      fontSize: FONT_SIZE,
    },
    textgroup: {
      paddingVertical: 1,
    },
    fence: {
      backgroundColor: theme.colors.app.bg,
      borderColor: theme.colors.app.bg,
      color: fontColor,
      fontSize: FONT_SIZE,
    },
    em: {
      fontStyle: "italic",
      color: fontColor,
      fontSize: FONT_SIZE,
    },
    strong: {
      fontWeight: "bold",
      color: fontColor,
      fontSize: FONT_SIZE,
    },
    s: {
      textDecorationLine: "line-through",
      color: fontColor,
      fontSize: FONT_SIZE,
    },
    body: {
      color: fontColor,
      fontSize: FONT_SIZE,
    },
    hr: {
      color: theme.colors.app.bg,
    },
  };

  // const cleanedText = findImages(text, false);
  // text = cleanedText.cleanedText.replace(
  //   /(^|[^[\]])\b(https?:\/\/[^\s]+)\b(?![\]]|\()/g,
  //   (match, prefix, url) => `${prefix}[${url}](${url})`
  // );
  // text = replaceNoMarkdown(text, currentAccount.instance);

  const markdown = text; // .replace(/\s\s+/g, "<br />");
  const onRequestClose = () => {
    setVisible(false);
  };

  return (
    <>
      <VStack flex={1}>
        <Markdown
          style={styles}
          rules={{
            image: (node, children, parent, styles) => {
              console.log(node.attributes);
              return (
                <ImageButton src={node.attributes.src} />
                // <Pressable
                //   onPress={() => {
                //     setImgSrc(node.attributes.src);
                //     setVisible(true);
                //   }}
                // >
                //   <HStack
                //     backgroundColor={theme.colors.app.bg}
                //     borderRadius={5}
                //     padding={2}
                //     flexDirection="row"
                //     alignItems="center"
                //     space={2}
                //     my={4}
                //   >
                //     <FastImage
                //       style={{
                //         height: 50,
                //         width: 50,
                //       }}
                //       resizeMode="contain"
                //       source={{
                //         uri: node.attributes.src,
                //       }}
                //     />
                //     <Spacer />
                //     <Text color={theme.colors.app.textPrimary}>
                //       {truncateImageLink(node.attributes.src)}
                //     </Text>
                //     <Spacer />
                //     <ChevronRightIcon />
                //   </HStack>
                // </Pressable>
              );
            },
          }}
          onLinkPress={onLinkPress}
        >
          {markdown}
        </Markdown>
        <ImageViewer
          source={imgSrc}
          nsfw={false}
          visibleOverride={visible}
          onRequestCloseOverride={onRequestClose}
          onlyViewer
        />
      </VStack>
    </>
  );
}

export default RenderMarkdown;
