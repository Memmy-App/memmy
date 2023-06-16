import ILemmyComment from "../../../lemmy/types/ILemmyComment";
import {useEffect, useState} from "react";
import {PostView} from "lemmy-js-client";
import {useAppDispatch, useAppSelector} from "../../../store";
import {selectPost} from "../../../slices/post/postSlice";
import LemmyCommentsHelper from "../../../lemmy/LemmyCommentsHelper";
import {lemmyAuthToken, lemmyInstance} from "../../../lemmy/LemmyInstance";
import {setUpdateVote} from "../../../slices/feed/feedSlice";
import {trigger} from "react-native-haptic-feedback";
import {useToast} from "native-base";
import {selectBookmarks} from "../../../slices/bookmarks/bookmarksSlice";
import {addBookmark, removeBookmark} from "../../../slices/bookmarks/bookmarksActions";

export const usePost = () => {
    const {
        post,
        newComment
    } = useAppSelector(selectPost);

    const bookmarks = useAppSelector(selectBookmarks);

    const [comments, setComments] = useState<ILemmyComment[] | null>(null);
    const [commentsLoading, setCommentsLoading] = useState<boolean>(true);
    const [commentsError, setCommentsError] = useState<boolean>(false);

    const [refresh, setRefresh] = useState(false);

    const [currentPost, setCurrentPost] = useState<PostView>(post);

    const [bookmarked, setBookmarked] = useState<boolean>(
        bookmarks?.findIndex((b) => b.postId === currentPost.post.id) !== -1
    );

    const dispatch = useAppDispatch();

    const toast = useToast();

    // Check if a post is saved
    useEffect(() => {
        // Set the post to the one set in the store
        doLoad();
    }, []);

    useEffect(() => {
        if(newComment) {
            // Create a new comment chain
            const lComment: ILemmyComment = {
                top: newComment.comment,
                replies: []
            };

            // If it's a top comment, add it to top of current chain
            if(newComment.isTopComment) {
                setComments([lComment, ...comments]);
            } else {
                const newChain = LemmyCommentsHelper.findAndAdd(comments, lComment);
                setComments(newChain);
                setRefresh(!refresh);
            }
        }
    }, [newComment]);

    /**
     * Load the comments for the current post
     */
    const doLoad = async () => {
        setCommentsLoading(true);
        setCommentsError(false);

        try {
            const commentsRes = await lemmyInstance.getComments({
                auth: lemmyAuthToken,
                post_id: currentPost.post.id,
                max_depth: 15,
                type_: "All",
                sort: "Top"
            });

            const helper = new LemmyCommentsHelper(commentsRes.comments);
            const parsed = helper.getParsed();

            setComments(parsed);
            setCommentsLoading(false);
        } catch(e) {
            setCommentsLoading(false);
            setCommentsError(true);
        }
    };

    /**
     * Vote on the current post
     * @param value
     */
    const doVote = async (value: -1 | 0 | 1) => {
        // If we already voted, this will be a neutral vote.
        if(value === currentPost.my_vote && value !== 0) value = 0;

        // Store old value incase we encounter an error
        const oldValue = currentPost.my_vote;

        // Play trigger
        trigger("impactMedium");

        // Update the state
        setCurrentPost({
            ...currentPost,
            my_vote: value
        });

        // Put result in store so we can change it when we go back
        dispatch(setUpdateVote({
            postId: post.post.id,
            vote: value
        }));

        // Send request
        try {
            await lemmyInstance.likePost({
                auth: lemmyAuthToken,
                post_id: post.post.id,
                score: value
            });
        } catch(e) {
            // If there was an error, reset the value and show a notification
            toast.show({
                title: "Error saving vote",
                duration: 3000
            });

            setCurrentPost({
                ...currentPost,
                my_vote: oldValue
            });
        }
    };

    /**
     * Bookmark the current post
     */
    const doBookmark = () => {
        if(bookmarked) {
            dispatch(removeBookmark(post.post.id));
            setBookmarked(false);
        } else {
            dispatch(addBookmark({
                postId: post.post.id,
                postName: post.post.name,
                postLink: post.post.ap_id
            }));
            setBookmarked(true);
        }
    };

    return {
        comments,
        commentsLoading,
        commentsError,
        doLoad,

        refresh,

        currentPost,

        bookmarked,
        doBookmark,

        doVote,
    };
};
