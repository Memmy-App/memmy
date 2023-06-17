export const findImages = (text: string) => {
    const pattern = /!\[(.*?)\]\((.*?)\)/g;

    let match;
    let imageUrl = null;

    while ((match = pattern.exec(text)) !== null) {
        const altText = match[1];
        imageUrl = match[2];
        break;
    }

    return imageUrl;
};