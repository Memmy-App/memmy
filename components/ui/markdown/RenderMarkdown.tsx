import React, { useEffect, useMemo } from "react";
import { useTheme, VStack } from "native-base";
import Markdown, { MarkdownIt } from "@ronradtke/react-native-markdown-display";
import { openLink } from "../../../helpers/LinkHelper";
import { findImages } from "../../../helpers/MarkdownHelper";
import ImageButton from "../ImageButton";

const FONT_SIZE = 14;
const HEADING_1_SIZE = 32;
const HEADING_2_SIZE = 26;
const HEADING_3_SIZE = 22;
const HEADING_4_SIZE = 18;

interface MarkdownProps {
  text: string;
  addImages?: boolean;
}

const RenderMarkdown = ({ text, addImages = false }: MarkdownProps) => {
  useEffect(() => {
    findImages(text);
  }, []);

  const onLinkPress = (url): boolean => {
    openLink(url).then();
    return false;
  };

  const theme = useTheme();

  const styles = {
    span: {
      fontSize: FONT_SIZE,
      color: "white",
    },
    inline: {
      fontSize: FONT_SIZE,
      color: "white",
    },
    paragraph: {
      fontSize: FONT_SIZE,
      color: "white",
    },
    heading1: {
      fontSize: HEADING_1_SIZE,
      fontWeight: "bold",
      color: "white",
    },
    heading2: {
      fontSize: HEADING_2_SIZE,
      fontWeight: "bold",
      color: "white",
    },
    heading3: {
      fontSize: HEADING_3_SIZE,
      fontWeight: "bold",
      color: "white",
    },
    heading4: {
      fontSize: HEADING_4_SIZE,
      fontWeight: "bold",
      color: "white",
    },
    blockquote: {
      backgroundColor: theme.colors.screen[700],
      borderRadius: 5,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.orange["500"],
      marginVertical: 10,
    },
    code_inline: {
      fontSize: FONT_SIZE,
      color: "white",
      backgroundColor: theme.colors.screen[700],
    },
    code_block: {
      fontSize: FONT_SIZE,
      color: "white",
      backgroundColor: theme.colors.screen[700],
      borderRadius: 5,
    },
    pre: {
      fontSize: FONT_SIZE,
      color: "white",
      backgroundColor: theme.colors.screen[700],
      borderRadius: 5,
    },
    image: {
      width: 200,
      height: 200,
    },
    link: {
      color: "rgba(0,176,255,0.63)",
      fontSize: FONT_SIZE,
    },
    table: {
      color: "white",
      fontSize: FONT_SIZE,
      borderColor: theme.colors.screen[500],
      marginVertical: 10,
    },
    th: {
      borderColor: theme.colors.screen[500],
      padding: 8,
      fontWeight: "bold",
    },
    td: {
      borderColor: theme.colors.screen[500],
      padding: 8,
    },
    tr: {
      borderColor: theme.colors.screen[500],
    },
    list_item: {
      color: "white",
      fontSize: FONT_SIZE,
    },
    textgroup: {
      paddingVertical: 1,
    },
    fence: {
      backgroundColor: theme.colors.screen[700],
      borderColor: theme.colors.screen[700],
      color: "white",
      fontSize: FONT_SIZE,
    },
    em: {
      fontStyle: "italic",
      color: "white",
      fontSize: FONT_SIZE,
    },
    strong: {
      fontWeight: "bold",
      color: "white",
      fontSize: FONT_SIZE,
    },
    s: {
      textDecorationLine: "line-through",
      color: "white",
      fontSize: FONT_SIZE,
    },
    body: {
      color: "white",
      fontSize: FONT_SIZE,
    },
    hr: {
      color: theme.colors.screen[600],
    },
  };

  const markdown = useMemo(() => {
    const src = findImages(text);
    return (
      <VStack flex={1}>
        <Markdown
          style={styles}
          onLinkPress={onLinkPress}
          markdownit={MarkdownIt({ typographer: true }).disable(["image"])}
        >
          {text ?? ""}
        </Markdown>
        {addImages && src && <ImageButton src={src} />}
      </VStack>
    );
  }, [text]);

  return markdown;
};

export default RenderMarkdown;
