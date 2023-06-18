import React, { useEffect, useMemo } from "react";
import { useTheme, VStack } from "native-base";
import Markdown, { MarkdownIt } from "@ronradtke/react-native-markdown-display";
import { openLink } from "../../../helpers/LinkHelper";
import { findImages } from "../../../helpers/MarkdownHelper";
import ImageButton from "../ImageButton";

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
      fontSize: 16,
      color: "white",
    },
    inline: {
      fontSize: 16,
      color: "white",
    },
    paragraph: {
      fontSize: 16,
      color: "white",
    },
    heading1: {
      fontSize: 32,
      fontWeight: "bold",
      color: "white",
    },
    heading2: {
      fontSize: 26,
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
      fontSize: 16,
      color: "white",
      backgroundColor: theme.colors.screen[700],
    },
    code_block: {
      fontSize: 16,
      color: "white",
      backgroundColor: theme.colors.screen[700],
      borderRadius: 5,
    },
    pre: {
      fontSize: 16,
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
      fontSize: 16,
    },
    table: {
      color: "white",
      fontSize: 16,
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
      fontSize: 16,
    },
    textgroup: {
      paddingVertical: 1,
    },
    fence: {
      backgroundColor: theme.colors.screen[700],
      borderColor: theme.colors.screen[700],
      color: "white",
      fontSize: 16,
    },
    em: {
      fontStyle: "italic",
      color: "white",
      fontSize: 16,
    },
    strong: {
      fontWeight: "bold",
      color: "white",
      fontSize: 16,
    },
    s: {
      textDecorationLine: "line-through",
      color: "white",
      fontSize: 16,
    },
    heading3: {
      fontSize: 22,
      fontWeight: "bold",
      color: "white",
    },
    heading4: {
      fontSize: 18,
      fontWeight: "bold",
      color: "white",
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
