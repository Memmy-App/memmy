/* eslint-disable react/no-unstable-nested-components */
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Markdown, { MarkdownIt } from "@ronradtke/react-native-markdown-display";
import { useTheme, View, VStack } from "native-base";
import React, { useMemo } from "react";
import { TextStyle, useWindowDimensions } from "react-native";
import { useAppSelector } from "../../../../store";
import { openLink } from "../../../helpers/LinkHelper";
import { replaceNoMarkdown } from "../../../helpers/MarkdownHelper";
import { selectCurrentAccount } from "../../../slices/accounts/accountsSlice";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import { fontSizeMap } from "../../../theme/fontSize";
import SpoilerContainer from "./SpoilerContainer";
import ImageViewer from "../ImageViewer/ImageViewer";

const MarkdownItInstance = MarkdownIt({ typographer: true }).use(
  require("markdown-it-container"),
  "spoiler",
  {
    validate(params) {
      return params.trim().match(/^spoiler\s+(.*)$/);
    },
  }
);

interface MarkdownProps {
  text: string;
  isNote?: boolean;
  instance?: string;
}

function RenderMarkdown({ text, isNote = false, instance }: MarkdownProps) {
  const currentAccount = useAppSelector(selectCurrentAccount);
  const { fontSize, isSystemTextSize } = useAppSelector(selectSettings);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const { fontScale } = useWindowDimensions();
  const fontModifier = fontSizeMap[fontSize];
  const FONT_SIZE = isSystemTextSize ? 14 / fontScale : 15 + fontModifier;
  const HEADING_1_SIZE = isSystemTextSize ? 32 / fontScale : 15 + fontModifier;
  const HEADING_2_SIZE = isSystemTextSize ? 26 / fontScale : 15 + fontModifier;
  const HEADING_3_SIZE = isSystemTextSize ? 22 / fontScale : 15 + fontModifier;
  const HEADING_4_SIZE = isSystemTextSize ? 18 / fontScale : 15 + fontModifier;

  const onLinkPress = (url): boolean => {
    openLink(url, navigation, theme.colors.app.bg);
    return false;
  };

  const theme = useTheme();

  const fontColor = theme.colors.app.textPrimary;

  const markdownStyles: Record<string, TextStyle> = {
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
  return useMemo(() => {
    const markdown = replaceNoMarkdown(text, currentAccount.instance, instance);

    return (
      <>
        <VStack flex={1}>
          <Markdown
            style={markdownStyles}
            rules={{
              container_spoiler: (node) => (
                <View key={node.key}>
                  <SpoilerContainer
                    node={node}
                    title={node.sourceInfo.replace("spoiler", "").trim()}
                  />
                </View>
              ),
              image: (node) => (
                <ImageViewer source={node.attributes.src} buttonMode />
              ),
            }}
            onLinkPress={onLinkPress}
            markdownit={MarkdownItInstance}
          >
            {markdown ?? ""}
          </Markdown>
        </VStack>
      </>
    );
  }, [
    text,
    FONT_SIZE,
    theme.colors.app.textPrimary,
    theme.colors.app.textSecondary,
    theme.colors.app.bg,
    theme.colors.app.border,
    theme.colors.app.accent,
  ]);
}

export default RenderMarkdown;
