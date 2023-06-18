import {trigger} from "react-native-haptic-feedback";

export const onVoteHapticFeedback = () => {
    setTimeout(function() {
        trigger("soft");
    }, 25)

    trigger("effectDoubleClick");
}

// these two are for if we need a different feedback for upvotes and downvotes
export const onUpvoteHapticFeedback = () => {
    onVoteHapticFeedback()
};

export const onDownVoteHapticFeedback = () => {
    onVoteHapticFeedback()
}