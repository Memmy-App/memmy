export const truncateName = (name: string): string => {
    if(name.length <= 16) return name;

    return name.slice(0,16) + "...";
};

export const truncateLink = (link: string): string => {
    if(link.length <= 36) return link;

    return link.slice(0,36) + "...";
};

export const truncatePost = (post: string): string => {
    if(!post) return "";

    if(post.length <= 500) return post;

    return post.slice(0,500) + "...";
};