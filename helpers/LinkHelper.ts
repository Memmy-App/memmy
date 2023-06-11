import * as WebBrowser from "expo-web-browser";

const imageExtensions = [
    "webp",
    "png",
    "avif",
    "heic",
    "jpeg",
    "jpg",
    "gif",
    "svg",
    "ico",
    "icns"
];

const videoExtensions = [
    "mp4",
    "mov",
    "m4a"
];

export interface LinkInfo {
    extType?: ExtensionType,
    link?: string,
}

export enum ExtensionType {
    NONE = 0,
    IMAGE = 1,
    VIDEO = 2,
    GENERIC = 3,
}

export const getLinkInfo = (link?: string): LinkInfo => {
    let type;

    if(!link) {
        type = ExtensionType.NONE;
    } else {
        const extension = link.split(".").pop();

        if (imageExtensions.includes(extension)) {
            type = ExtensionType.IMAGE;
        } else if (videoExtensions.includes(extension)) {
            type = ExtensionType.VIDEO;
        } else {
            type = ExtensionType.GENERIC;
        }
    }

    return {
        link,
        extType: type
    };
};

export const openLink = async (link: string): Promise<WebBrowser.WebBrowserResult> => {
    return WebBrowser.openBrowserAsync(link);
};