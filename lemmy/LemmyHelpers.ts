import {Post} from "lemmy-js-client";
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