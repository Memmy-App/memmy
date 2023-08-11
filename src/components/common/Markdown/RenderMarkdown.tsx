/* eslint-disable react/no-unstable-nested-components */
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Markdown, { MarkdownIt } from "@ronradtke/react-native-markdown-display";
import { View } from "@src/components/common/Gluestack";
import {
  useSettingsStore,
  useThemeOptions,
} from "@src/stores/settings/settingsStore";
import React, { useMemo } from "react";
import { TextStyle, useWindowDimensions } from "react-native";
import { openLink } from "../../../helpers/LinkHelper";
import { replaceNoMarkdown } from "../../../helpers/MarkdownHelper";
import { useCurrentAccount } from "../../../stores/account/accountStore";
import { fontSizeMap } from "../../../theme/fontSize";
import ImageViewer from "../ImageViewer/ImageViewer";
import SpoilerContainer from "./SpoilerContainer";

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
  const currentAccount = useCurrentAccount();

  const { fontSize, isSystemTextSize } = useSettingsStore((state) => ({
    fontSize: state.settings.fontSize,
    isSystemTextSize: state.settings.isSystemTextSize,
  }));

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const { fontScale } = useWindowDimensions();
  const fontModifier = fontSizeMap[fontSize];
  const FONT_SIZE = isSystemTextSize ? 14 / fontScale : 14 + fontModifier;
  const HEADING_1_SIZE = isSystemTextSize ? 32 / fontScale : 32 + fontModifier;
  const HEADING_2_SIZE = isSystemTextSize ? 26 / fontScale : 26 + fontModifier;
  const HEADING_3_SIZE = isSystemTextSize ? 22 / fontScale : 22 + fontModifier;
  const HEADING_4_SIZE = isSystemTextSize ? 18 / fontScale : 18 + fontModifier;

  const onLinkPress = (url): boolean => {
    openLink(url, navigation, theme.colors.bg);
    return false;
  };

  const theme = useThemeOptions();

  const fontColor = theme.colors.textPrimary;

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
      color: isNote ? theme.colors.textSecondary : fontColor,
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
      backgroundColor: theme.colors.bg,
      borderRadius: 5,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.accent,
      marginVertical: 10,
    },
    code_inline: {
      fontSize: FONT_SIZE,
      color: fontColor,
      backgroundColor: theme.colors.bg,
    },
    code_block: {
      fontSize: FONT_SIZE,
      color: fontColor,
      backgroundColor: theme.colors.bg,
      borderRadius: 5,
    },
    pre: {
      fontSize: FONT_SIZE,
      color: fontColor,
      backgroundColor: theme.colors.bg,
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
      borderColor: theme.colors.border,
      marginVertical: 10,
    },
    th: {
      borderColor: theme.colors.border,
      padding: 8,
      fontWeight: "bold",
    },
    td: {
      borderColor: theme.colors.border,
      padding: 8,
    },
    tr: {
      borderColor: theme.colors.border,
    },
    list_item: {
      color: fontColor,
      fontSize: FONT_SIZE,
    },
    textgroup: {
      paddingVertical: 1,
    },
    fence: {
      backgroundColor: theme.colors.bg,
      borderColor: theme.colors.bg,
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
      color: theme.colors.bg,
    },
  };
  return useMemo(() => {
    const markdown = replaceNoMarkdown(text, currentAccount.instance, instance);

    return (
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
          image: (node) => <ImageViewer source={node.attributes.src} />,
        }}
        onLinkPress={onLinkPress}
        markdownit={MarkdownItInstance}
      >
        {markdown ?? ""}
      </Markdown>
    );
  }, [
    text,
    FONT_SIZE,
    theme.colors.textPrimary,
    theme.colors.textSecondary,
    theme.colors.bg,
    theme.colors.border,
    theme.colors.accent,
  ]);
}

export default RenderMarkdown;
