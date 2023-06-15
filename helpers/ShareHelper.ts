import {Share} from "react-native";

interface ShareLinkOptions {
    title: string,
    link: string
}

export const shareLink = (
    {
        title,
        link
    }: ShareLinkOptions
) => {
    try {
        Share.share({
            url: link,
            title
        });
    } catch { /* empty */ }
};