import {CommunityView, Post, PostView} from "lemmy-js-client";
import ELemmyPostType from "./types/ELemmyPostType";

export const getType = (post: Post): ELemmyPostType => {
    if(post.body) {
        return ELemmyPostType.POST;
    } else if(post.url) {
        return ELemmyPostType.URL;
    } else if(post.embed_video_url) {
        return ELemmyPostType.VIDEO;
    } else if(post.thumbnail_url) {
        return ELemmyPostType.IMAGE;
    }
};

export const isSubscribed = (communityId: number, communities: CommunityView[]): boolean => {
    const res = communities.find((c) => c.community.id === communityId);

    return !!res;
};

export const removeDuplicatePosts = (currentList: PostView[], newItems: PostView[]) => {
    return newItems.filter((p) => currentList.findIndex((pp) => pp.post.id === p.post.id) === -1);
};