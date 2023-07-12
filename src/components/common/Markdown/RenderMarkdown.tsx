// @ts-nocheck
import React, { useMemo } from "react";
import { Image, Text, useTheme, VStack } from "native-base";
import Markdown, { MarkdownIt } from "@ronradtke/react-native-markdown-display";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useWindowDimensions } from "react-native";
import ReactMarkdown from "react-markdown";
import WebView from "react-native-webview";
import { openLink } from "../../../helpers/LinkHelper";
import { findImages, replaceNoMarkdown } from "../../../helpers/MarkdownHelper";
import ImageButton from "../Buttons/ImageButton";
import { useAppSelector } from "../../../../store";
import { selectCurrentAccount } from "../../../slices/accounts/accountsSlice";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import { fontSizeMap } from "../../../theme/fontSize";
import ImageViewer from "../ImageViewer/ImageViewer";

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

const RenderMarkdown = ({
  text,
  addImages = false,
  truncate = false,
  isNote = false,
  imageSize,
}: MarkdownProps) => {
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
    openLink(url, navigation);
    return false;
  };

  const theme = useTheme();

  const fontColor = truncate
    ? theme.colors.app.textSecondary
    : theme.colors.app.textPrimary;

  const styles = {
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
      marginVertical: 5,
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
    image: {
      width: 200,
      height: 200,
    },
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
    // const cleanedText = findImages(text, false);
    // text = cleanedText.cleanedText.replace(
    //   /(^|[^[\]])\b(https?:\/\/[^\s]+)\b(?![\]]|\()/g,
    //   (match, prefix, url) => `${prefix}[${url}](${url})`
    // );
    // text = replaceNoMarkdown(text, currentAccount.instance);

    const markdown = text; // .replace(/\s\s+/g, "<br />");

    return (
      <VStack flex={1} my={1}>
        <Text>
          <ReactMarkdown
            components={{
              // basic text
              p: ({ children }) => <Text style={styles.body}>{children}</Text>,
              text: ({ children }) => (
                <Text style={styles.body}>{children}</Text>
              ),
              strong: ({ children }) => (
                <Text style={styles.strong}>{children}</Text>
              ),
              em: ({ children }) => <Text style={styles.em}>{children}</Text>,

              // headings
              h1: ({ children }) => (
                <Text style={styles.heading1}>{children}</Text>
              ),
              h2: ({ children }) => (
                <Text style={styles.heading2}>{children}</Text>
              ),
              h3: ({ children }) => (
                <Text style={styles.heading3}>{children}</Text>
              ),
              h4: ({ children }) => (
                <Text style={styles.heading4}>{children}</Text>
              ),
              h5: ({ children }) => (
                <Text style={styles.heading5}>{children}</Text>
              ),
              br: ({ children }) => <Text>{children}</Text>,
              img: ({ children, src }) => {
                console.log(src);
                return (
                  <ImageViewer source={src} resizeMode="cover" nsfw={false} />
                );
              },
              a: ({ children }) => <Text>{children}</Text>,
              abbr: ({ children }) => <Text>{children}</Text>,
              article: ({ children }) => <Text>{children}</Text>,
              hr: ({ children }) => <Text>{children}</Text>,
              link: ({ children }) => <Text>{children}</Text>,
              blockquote: ({ children }) => (
                <Text style={styles.blockquote}>{children}</Text>
              ),
              code: ({ children }) => <Text>{children}</Text>,
              del: ({ children }) => <Text>{children}</Text>,
              details: ({ children }) => <Text>{children}</Text>,
              div: ({ children }) => <Text>{children}</Text>,
              dl: ({ children }) => <Text>{children}</Text>,
              dt: ({ children }) => <Text>{children}</Text>,
              em: ({ children }) => <Text>{children}</Text>,
              fieldset: ({ children }) => <Text>{children}</Text>,
              figure: ({ children }) => <Text>{children}</Text>,
              figcaption: ({ children }) => <Text>{children}</Text>,
              footer: ({ children }) => <Text>{children}</Text>,
              form: ({ children }) => <Text>{children}</Text>,
              hgroup: ({ children }) => <Text>{children}</Text>,
              header: ({ children }) => <Text>{children}</Text>,
              ins: ({ children }) => <Text>{children}</Text>,
              kbd: ({ children }) => <Text>{children}</Text>,
              label: ({ children }) => <Text>{children}</Text>,
              legend: ({ children }) => <Text>{children}</Text>,
              li: ({ children }) => <Text>- {children}</Text>,
              main: ({ children }) => <Text>{children}</Text>,
              mark: ({ children }) => <Text>{children}</Text>,
              nav: ({ children }) => <Text>{children}</Text>,
              ol: ({ children }) => <Text>{children}</Text>,
              optgroup: ({ children }) => <Text>{children}</Text>,
              option: ({ children }) => <Text>{children}</Text>,
              pre: ({ children }) => <Text>{children}</Text>,
              q: ({ children }) => <Text>{children}</Text>,
              s: ({ children }) => <Text>{children}</Text>,
              section: ({ children }) => <Text>{children}</Text>,
              select: ({ children }) => <Text>{children}</Text>,
              small: ({ children }) => <Text>{children}</Text>,
              span: ({ children }) => <Text>{children}</Text>,
              br: ({ children }) => <Text>{children}</Text>,
              sub: ({ children }) => <Text>{children}</Text>,
              sup: ({ children }) => <Text>{children}</Text>,
              table: ({ children }) => <Text>{children}</Text>,
              tbody: ({ children }) => <Text>{children}</Text>,
              td: ({ children }) => <Text>{children}</Text>,
              textarea: ({ children }) => <Text>{children}</Text>,
              tfoot: ({ children }) => <Text>{children}</Text>,
              th: ({ children }) => <Text>{children}</Text>,
              thead: ({ children }) => <Text>{children}</Text>,
              tr: ({ children }) => <Text>{children}</Text>,
              u: ({ children }) => <Text>{children}</Text>,
              ul: ({ children }) => <Text>{children}</Text>,
              video: ({ children }) => <Text>{children}</Text>,
              body: ({ children }) => <Text>{children}</Text>,
              address: ({ children }) => <Text>{children}</Text>,
              area: ({ children }) => <Text>{children}</Text>,
              aside: ({ children }) => <Text>{children}</Text>,
              audio: ({ children }) => <Text>{children}</Text>,
              big: ({ children }) => <Text>{children}</Text>,
              button: ({ children }) => <Text>{children}</Text>,
              canvas: ({ children }) => <Text>{children}</Text>,
              caption: ({ children }) => <Text>{children}</Text>,
              defs: ({ children }) => <Text>{children}</Text>,
              desc: ({ children }) => <Text>{children}</Text>,
              ellipse: ({ children }) => <Text>{children}</Text>,
              base: ({ children }) => <Text>{children}</Text>,
              image: ({ children }) => <Text>{children}</Text>,
            }}
          >
            {markdown}
          </ReactMarkdown>
        </Text>
      </VStack>
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
};

export default RenderMarkdown;
