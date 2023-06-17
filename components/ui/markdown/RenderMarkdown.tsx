import React from "react";
import Markdown from "markdown-to-jsx";
import WebLink from "../WebLink";
import {Text, VStack} from "native-base";
import MarkdownText from "./MarkdownText";
import MarkdownImage from "./MarkdownImage";
import MarkdownHeaderOne from "./MarkdownHeaderOne";
import MarkdownHeaderTwo from "./MarkdownHeaderTwo";
import MarkdownBreak from "./MarkdownBreak";
import MarkdownWrapper from "./MarkdownWrapper";
import {ErrorBoundary} from "react-error-boundary";
import {Dimensions} from "react-native";
import MarkdownListItem from "./MarkdownListItem";
import MarkdownList from "./MarkdownList";
import MarkdownCode from "./MarkdownCode";
import MarkdownDetails from "./MarkdownDetails";
import MarkdownPre from "./MarkdownPre";
import MarkdownBlockquote from "./MarkdownBlockquote";

interface MarkdownProps {
    text: string
}

const RenderMarkdown = ({text}: MarkdownProps) => {

    return (
        <ErrorBoundary fallback={(
            <Text fontSize={"md"} color={"white"}>
                {text}
            </Text>
        )}>
            <Markdown
                options={{
                    wrapper: MarkdownWrapper,
                    forceWrapper: true,
                    forceBlock: true,
                    overrides: {
                        a: {
                            component: WebLink
                        },
                        h1: {
                            component: MarkdownHeaderOne
                        },
                        h2: {
                            component: MarkdownHeaderTwo
                        },
                        h3: {
                            component: MarkdownText,
                            props: {
                                fontSize: "xl",
                                fontWeight: "bold",
                                mb: 2
                            }
                        },
                        h4: {
                            component: MarkdownText,
                            props: {
                                fontSize: "lg",
                                fontWeight: "bold",
                                mb: 2
                            },
                        },
                        h5: {
                            component: MarkdownText,
                            props: {
                                fontSize: "md",
                                fontWeight: "bold",
                                mb: 2
                            },
                        },
                        b: {
                            component: MarkdownText,
                            props: {
                                fontWeight: "bold"
                            },
                        },
                        i: {
                            component: MarkdownText,
                            props: {
                                fontStyle: "italic"
                            },
                        },
                        p: {
                            component: MarkdownText,
                            props: {
                                mb: 2,
                                fontSize: "md",
                                fontColor: "white",
                            }
                        },
                        img: MarkdownText,
                        image: MarkdownText,
                        picture: MarkdownImage,
                        span: {
                            component: MarkdownText,
                            props: {
                                mb: 2,
                                fontSize: "md",
                                fontColor: "white",
                            }
                        },
                        bold: MarkdownText,
                        italic: MarkdownText,
                        li: MarkdownList,
                        ol: MarkdownList,
                        ul: MarkdownList,
                        code: MarkdownCode,
                        pre: MarkdownPre,
                        details: MarkdownDetails,
                        blockquote: MarkdownBlockquote,
                        // This is messy, but to prevent any HTML tags from being rendered, we need to override all of them
                        abbr: MarkdownText,
                        address: MarkdownText,
                        article: MarkdownText,
                        aside: MarkdownText,
                        audio: MarkdownText,
                        bdi: MarkdownText,
                        bdo: MarkdownText,
                        br: MarkdownBreak,
                        button: MarkdownText,
                        canvas: MarkdownText,
                        caption: MarkdownText,
                        cite: MarkdownText,
                        col: MarkdownText,
                        colgroup: MarkdownText,
                        data: MarkdownText,
                        datalist: MarkdownText,
                        dd: MarkdownText,
                        del: MarkdownText,
                        dfn: MarkdownText,
                        dialog: MarkdownText,
                        div: MarkdownText,
                        dl: MarkdownText,
                        dt: MarkdownText,
                        em: MarkdownText,
                        embed: MarkdownText,
                        fieldset: MarkdownText,
                        figcaption: MarkdownText,
                        figure: MarkdownText,
                        footer: MarkdownText,
                        form: MarkdownText,
                        h6: MarkdownText,
                        header: MarkdownText,
                        hr: MarkdownText,
                        iFrame: MarkdownText,
                        ins: MarkdownText,
                        kbd: MarkdownText,
                        label: MarkdownText,
                        legend: MarkdownText,
                        main: MarkdownText,
                        map: MarkdownText,
                        mark: MarkdownText,
                        meter: MarkdownText,
                        nav: MarkdownText,
                        noscript: MarkdownText,
                        object: MarkdownText,
                        optgroup: MarkdownText,
                        option: MarkdownText,
                        output: MarkdownText,
                        progress: MarkdownText,
                        q: MarkdownText,
                        rp: MarkdownText,
                        rt: MarkdownText,
                        ruby: MarkdownText,
                        s: MarkdownText,
                        samp: MarkdownText,
                        script: MarkdownText,
                        section: MarkdownText,
                        select: MarkdownText,
                        small: MarkdownText,
                        source: MarkdownText,
                        strong: MarkdownText,
                        style: MarkdownText,
                        sub: MarkdownText,
                        summary: MarkdownText,
                        sup: MarkdownText,
                        svg: MarkdownText,
                        table: MarkdownText,
                        tbody: MarkdownText,
                        td: MarkdownText,
                        textarea: MarkdownText,
                        tfoot: MarkdownText,
                        th: MarkdownText,
                        thead: MarkdownText,
                        time: MarkdownText,
                        tr: MarkdownText,
                        track: MarkdownText,
                        u: MarkdownText,
                        var: MarkdownText,
                        video: MarkdownText,
                        wbr: MarkdownText,
                    }
                }}
            >
                {text}
            </Markdown>
        </ErrorBoundary>
    );
};

export default RenderMarkdown;