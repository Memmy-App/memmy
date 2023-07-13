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
  | "couldnt_find_community"
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
  | "could_not_find_object"
  | "incorrect_login";

interface LemmyError {
  code: LemmyErrorType;
  message: string;
}

export const lemmyErrors: LemmyError[] = [
  {
    code: "post_not_found",
    message: "The post you are trying to interact with was not found.",
  },
  {
    code: "not_logged_in",
    message:
      "You are not currently logged in. Your session may have expired. Please try signing back in.",
  },
  {
    code: "password_incorrect",
    message: "The password you have entered is incorrect.",
  },
  {
    code: "report_reason_required",
    message: "You must enter a reason for your report.",
  },
  {
    code: "not_a_moderator",
    message: "You are not a moderator of this community.",
  },
  { code: "not_an_admin", message: "You are not an admin of this instance." },
  {
    code: "email_not_verified",
    message:
      "Your email address is not verified. Please verify your email and try again.",
  },
  { code: "email_required", message: "You must enter a valid email address." },
  {
    code: "could_not_update_comment",
    message: "Unable to update the comment.",
  },
  {
    code: "could_not_update_private_message",
    message: "Unable to update private message.",
  },
  { code: "site_ban", message: "You are banned from this instance." },
  {
    code: "deleted",
    message: "The content you are trying to interact with has been deleted.",
  },
  {
    code: "banned_from_community",
    message: "You are banned from this community.",
  },
  {
    code: "couldnt_find_community",
    message: "Unable to find the requested community.",
  },
  {
    code: "could_not_create_comment",
    message: "Unable to create your comment.",
  },
  {
    code: "edit_comment_not_allowed",
    message: "You are not allowed to edit this comment.",
  },
  {
    code: "language_not_allowed",
    message:
      "You are not allowed to create a post or comment in this language.",
  },
  {
    code: "email_already_exists",
    message: "The email you entered already exists.",
  },
  { code: "federation_error", message: "A federation error has occurred." },
  {
    code: "invalid_community",
    message: "The community you have requested is invalid.",
  },
  {
    code: "cannot_create_post_or_comment_in_deleted_or_removed_community",
    message:
      "The community you are trying to create a post or comment in has been deleted or removed.",
  },
  {
    code: "cannot_receive_page",
    message: "Unable to receive the requested page.",
  },
  {
    code: "new_post_cannot_be_locked",
    message: "A new post here cannot be locked.",
  },
  {
    code: "rate_limit_error",
    message: "You have reached the rate limit. Please try again shortly.",
  },
  { code: "invalid_name", message: "The name you have entered is invalid." },
  { code: "missing_totp_token", message: "You must enter your TOTP token." },
  {
    code: "incorrect_totp_token",
    message: "The TOTP token you have entered is incorrect.",
  },
  {
    code: "could_not_parse_totp_secret",
    message: "An error occurred while parsing your TOTP secret.",
  },
  { code: "could_not_like_comment", message: "Unable to like comment." },
  { code: "could_not_save_comment", message: "Unable to save comment." },
  { code: "could_not_create_report", message: "Unable to create the report." },
  { code: "could_not_resolve_report", message: "Unable to resolve the report" },
  {
    code: "person_block_already_exists",
    message: "You have already blocked this user.",
  },
  { code: "user_already_exists", message: "That username already exists." },
  { code: "could_not_like_post", message: "Unable to like post." },
  { code: "could_not_save_post", message: "Unable to save post." },
  {
    code: "could_not_mark_post_as_read",
    message: "Unable to mark post as read.",
  },
  {
    code: "could_not_update_comment",
    message: "Unable to update the community.",
  },
  { code: "could_not_update_replies", message: "Unable to update replies." },
  {
    code: "could_not_update_person_mentions",
    message: "Unable to update mentions.",
  },
  { code: "could_not_update", message: "Unable to update the requested item." },
  {
    code: "post_title_too_long",
    message: "The post title you have entered is too long.",
  },
  { code: "could_not_create_post", message: "Unable to create the post." },
  {
    code: "could_not_create_private_message",
    message: "Unable to create the private message.",
  },
  { code: "could_not_update_private", message: "Unable to update to private." },
  {
    code: "could_not_get_comments",
    message: "Unable to retrieve the comments for this post.",
  },
  { code: "could_not_get_posts", message: "Unable to retrieve posts." },
  { code: "invalid_url", message: "The URL you have entered is invalid." },
  {
    code: "email_send_failed",
    message: "An error occurred while sending the email.",
  },
  {
    code: "slurs",
    message:
      "The post or comment you are trying to create contains slurs not allowed on this instance.",
  },
  {
    code: "could_not_generate_totp",
    message: "Unable to generate a TOTP token.",
  },
  {
    code: "could_not_find_object",
    message: "The resource you are attempting to access could not be found.",
  },
  {
    code: "incorrect_login",
    message: "The username or password you have entered is incorrect.",
  },
];

export const alertableErrors: LemmyErrorType[] = ["not_logged_in"];
