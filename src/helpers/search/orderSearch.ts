import {
  CommentView,
  CommunityView,
  PersonView,
  PostView,
} from 'lemmy-js-client';
import Fuse from 'fuse.js';
import IFuseOptions = Fuse.IFuseOptions;

export const orderSearch = (
  arr: Array<CommunityView | PersonView | PostView | CommentView>,
  keyword: string,
): Array<CommunityView | PersonView | PostView | CommentView> => {
  const options: IFuseOptions<unknown> = {
    isCaseSensitive: false,
    includeScore: false,
    shouldSort: true,
    includeMatches: true,
    findAllMatches: false,
    minMatchCharLength: 1,
    location: 0,
    threshold: 0.6,
    distance: 500,
    useExtendedSearch: false,
    ignoreLocation: true,
    ignoreFieldNorm: false,
    fieldNormWeight: 1,
    keys: [
      {
        name: 'community.name',
        weight: 0.85,
      },
      {
        name: 'community.title',
        weight: 0.5,
      },
      {
        name: 'person.name',
        weight: 0.7,
      },
      {
        name: 'person.display_name',
        weight: 0.3,
      },
      {
        name: 'post.name',
        weight: 0.8,
      },
      {
        name: 'comment.content',
        weight: 0.4,
      },
      {
        name: 'comment.creator',
        weight: 0.2,
      },
    ],
  };

  const fuse = new Fuse(arr, options);
  const res = fuse.search(keyword);

  return res.map((r) => r.item);
};
