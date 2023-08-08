interface ICreatePostOptions {
  title: string;
  url?: string;
  body?: string;
  nsfw: boolean;
  communityId: number;
  languageId?: number;
}
