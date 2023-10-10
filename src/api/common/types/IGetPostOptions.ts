import { ListingType, SortType } from 'lemmy-js-client';

export default interface IGetPostOptions {
  communityId?: number;
  communityName?: string;
  limit?: number;
  page?: number;
  sort?: SortType;
  type?: ListingType;
}
