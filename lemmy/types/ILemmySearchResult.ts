import { CommunityView, PersonView, PostView } from "lemmy-js-client";

interface ILemmySearchResult {
  users?: PersonView[] | undefined;
  communities?: CommunityView[] | undefined;
  posts?: PostView[] | undefined;
}

export default ILemmySearchResult;
