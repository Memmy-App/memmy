import React from "react";
import {useTheme} from "native-base";
import Markdown from "@ronradtke/react-native-markdown-display";

interface MarkdownProps {
    text: string
}

const RenderMarkdown = ({text}: MarkdownProps) => {
    const theme = useTheme();

    const styles = {
        span: {
            fontSize: 16,
            color: "white"
        },
        inline: {
            fontSize: 16,
            color: "white"
        },
        paragraph: {
            fontSize: 16,
            color: "white"
        },
        heading1: {
            fontSize: 32,
            fontWeight: "bold",
            color: "white"
        },
        heading2: {
            fontSize: 26,
            fontWeight: "bold",
            color: "white"
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
            height: 200
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
        }
    };

    return (
        <Markdown style={styles}>
            {text.toString()}
        </Markdown>
    );
};

export default RenderMarkdown;