import { CommunityView, PersonViewSafe, PostView } from "lemmy-js-client";

interface ILemmySearchResult {
  users: PersonViewSafe[] | undefined;
  communities: CommunityView[] | undefined;
  posts: PostView[] | undefined;
}

export default ILemmySearchResult;
