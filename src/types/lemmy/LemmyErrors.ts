export type LemmyErrorType =
  | "post_not_found"
  | "not_logged_in"
  | "password_incorrect"
  | "report_reason_required"
  | "not_a_moderator"
  | "not_an_admin"
  | "email_not_verified"
  | "email_required"
  | "could_not_update_comment"
  | "could_not_update_private_message"
  | "site_ban"
  | "deleted"
  | "banned_from_community"
  | "could_not_find_community"
  | "could_not_create_comment"
  | "edit_comment_not_allowed"
  | "language_not_allowed"
  | "email_already_exists"
  | "federation_error"
  | "invalid_community"
  | "cannot_create_post_or_comment_in_deleted_or_removed_community"
  | "cannot_receive_page"
  | "new_post_cannot_be_locked"
  | "rate_limit_error"
  | "invalid_name"
  | "missing_totp_token"
  | "incorrect_totp_token"
  | "could_not_parse_totp_secret"
  | "could_not_like_comment"
  | "could_not_save_comment"
  | "could_not_create_report"
  | "could_not_resolve_report"
  | "person_block_already_exists"
  | "user_already_exists"
  | "could_not_like_post"
  | "could_not_save_post"
  | "could_not_mark_post_as_read"
  | "could_not_update_community"
  | "could_not_update_replies"
  | "could_not_update_person_mentions"
  | "could_not_update"
  | "post_title_too_long"
  | "could_not_create_post"
  | "could_not_create_private_message"
  | "could_not_update_private"
  | "banned"
  | "could_not_get_comments"
  | "could_not_get_posts"
  | "invalid_url"
  | "email_send_failed"
  | "slurs"
  | "could_not_generate_totp"
  | "could_not_find_object";

export type LemmyError = [key: LemmyErrorType, display: string];

export const lemmyErrors: LemmyError[] = [
  ["post_not_found", "The post you are trying to interact with was not found."],
  [
    "not_logged_in",
    "You are not currently logged in. Your session may have expired. Please try signing back in.",
  ],
  ["password_incorrect", "The password you have entered is incorrect."],
  ["report_reason_required", "You must enter a reason for your report."],
  ["not_a_moderator", "You are not a moderator of this community."],
  ["not_an_admin", "You are not an admin of this instance."],
  [
    "email_not_verified",
    "Your email address is not verified. Please verify your email and try again.",
  ],
  ["email_required", "You must enter a valid email address."],
  ["could_not_update_comment", "Unable to update the comment."],
  ["could_not_update_private_message", "Unable to update private message."],
  ["site_ban", "You are banned from this instance."],
  ["deleted", "The content you are trying to interact with has been deleted."],
  ["banned_from_community", "You are banned from this community."],
  ["could_not_find_community", "Unable to find the requested community."],
  ["could_not_create_comment", "Unable to create your comment."],
  ["edit_comment_not_allowed", "You are not allowed to edit this comment."],
  [
    "language_not_allowed",
    "You are not allowed to create a post or comment in this language.",
  ],
  ["email_already_exists", "The email you entered already exists."],
  ["federation_error", "A federation error has occurred."],
  ["invalid_community", "The community you have requested is invalid."],
  [
    "cannot_create_post_or_comment_in_deleted_or_removed_community",
    "The community you are trying to create a post or comment in has been deleted or removed.",
  ],
  ["cannot_receive_page", "Unable to receive the requested page."],
  ["new_post_cannot_be_locked", "A new post here cannot be locked."],
  [
    "rate_limit_error",
    "You have reached the rate limit. Please try again shortly.",
  ],
  ["invalid_name", "The name you have entered is invalid."],
  ["missing_totp_token", "You must enter your TOTP token."],
  ["incorrect_totp_token", "The TOTP token you have entered is incorrect."],
  [
    "could_not_parse_totp_secret",
    "An error occurred while parsing your TOTP secret.",
  ],
  ["could_not_like_comment", "Unable to like comment."],
  ["could_not_save_comment", "Unable to save comment."],
  ["could_not_create_report", "Unable to create the report."],
  ["could_not_resolve_report", "Unable to resolve the report"],
  ["person_block_already_exists", "You have already blocked this user."],
  ["user_already_exists", "That username already exists."],
  ["could_not_like_post", "Unable to like post."],
  ["could_not_save_post", "Unable to save post."],
  ["could_not_mark_post_as_read", "Unable to mark post as read."],
  ["could_not_update_comment", "Unable to update the community."],
  ["could_not_update_replies", "Unable to update replies."],
  ["could_not_update_person_mentions", "Unable to update mentions."],
  ["could_not_update", "Unable to update the requested item."],
  ["post_title_too_long", "The post title you have entered is too long."],
  ["could_not_create_post", "Unable to create the post."],
  ["could_not_create_private_message", "Unable to create the private message."],
  ["could_not_update_private", "Unable to update to private."],
  ["could_not_get_comments", "Unable to retrieve the comments for this post."],
  ["could_not_get_posts", "Unable to retrieve posts."],
  ["invalid_url", "The URL you have entered is invalid."],
  ["email_send_failed", "An error occurred while sending the email."],
  [
    "slurs",
    "The post or comment you are trying to create contains slurs not allowed on this instance.",
  ],
  ["could_not_generate_totp", "Unable to generate a TOTP token."],
  [
    "could_not_find_object",
    "The resource you are attempting to access could not be found.",
  ],
];

export const alertableErrors: LemmyErrorType[] = [
  "not_logged_in",
  "password_incorrect",
];
