import {
  CommentResponse,
  GetCaptchaResponse,
  GetCommentsResponse,
  GetCommunityResponse,
  GetPersonDetailsResponse,
  GetPostResponse,
  GetPostsResponse,
  GetRepliesResponse,
  GetSiteResponse,
  GetUnreadCountResponse,
  LemmyHttp,
  ListCommunitiesResponse,
  PostResponse,
} from 'lemmy-js-client';
import { getReadableVersion } from 'react-native-device-info';
import { ISignupOptions } from '@api/common/types';
import { getBaseUrl } from '@helpers/links/getBaseUrl';
import { writeToLog } from '@helpers/LogHelper';
import ApiOptions from '@api/common/types/IApiOptions';
import { ILemmyVote } from '@api/lemmy/types';
import IGetPostOptions from '@api/common/types/IGetPostOptions';
import ICreatePostOptions from '@api/common/types/ICreatePostOptions';
import { useSettingsStore } from '@src/state/settings/settingsStore';
import { usePostStore } from '@src/state/post/postStore';
import { useFeedStore } from '@src/state/feed/feedStore';

export enum EInitializeResult {
  SUCCESS,
  PASSWORD,
  TOTP,
  CAPTCHA,
  VERIFY_EMAIL,
}

class ApiInstance {
  apiType: 'lemmy' | 'kbin' = 'lemmy';

  username: string = '';

  instance: LemmyHttp | null = null; // TODO Kbin client will need to be added here

  captchaUuid: string | null = null;

  captchaPng: string | null = null;

  initialized: boolean = false;

  authToken: string | null = null;

  async initialize(
    options: ApiOptions,
    signup = false,
    signupOptions?: ISignupOptions,
  ): Promise<EInitializeResult> {
    this.username = options.username;
    this.apiType = 'lemmy';

    if (options.type === 'lemmy') {
      this.instance = new LemmyHttp(`https://${getBaseUrl(options.host)}`, {
        fetchFunction: undefined,
        headers: {
          'User-Agent': `Memmy ${getReadableVersion()}`,
          Authorization: options.authToken ?? `Bearer ${options.authToken}`,
        },
      });

      if (options.authToken != null) {
        this.initialized = true;
        this.authToken = options.authToken;

        return EInitializeResult.SUCCESS;
      }

      if (signup) {
        try {
          if (options.password == null) {
            return EInitializeResult.PASSWORD;
          }

          const res = await this.instance.register({
            username: options.username,
            email: signupOptions?.email,
            password: options.password,
            password_verify: options.password,
            show_nsfw: signupOptions != null ? signupOptions.showNsfw : false,
            captcha_uuid: signupOptions?.captchaUuid ?? undefined,
            captcha_answer: signupOptions?.captchaAnswer,
          });

          if (res.verify_email_sent) {
            return EInitializeResult.VERIFY_EMAIL;
          }

          if (res.jwt == null) {
            return EInitializeResult.PASSWORD;
          }

          options.authToken = res.jwt;
          this.authToken = res.jwt;

          void this.initialize(options);

          return EInitializeResult.SUCCESS;
        } catch (e: any) {
          if (e.toString() === 'captcha_incorrect') {
            return EInitializeResult.CAPTCHA;
          }

          return EInitializeResult.PASSWORD;
        }
      }

      try {
        const res = await this.instance.login({
          username_or_email: options.username,
          password: options.password ?? '',
          totp_2fa_token: options.totpToken ?? undefined,
        });

        if (res.jwt == null) {
          return EInitializeResult.PASSWORD;
        }

        options.authToken = res.jwt;
        this.authToken = res.jwt;

        void this.initialize(options);

        return EInitializeResult.SUCCESS;
      } catch (e: any) {
        this.resetInstance();

        if (e.toString() === 'missing_totp_token') {
          return EInitializeResult.TOTP;
        }

        return EInitializeResult.PASSWORD;
      }
    } else {
      return EInitializeResult.PASSWORD;
    }
  }

  resetInstance(): void {
    this.instance = null;
    this.initialized = false;
  }

  static handleError(error: string): string {
    // TODO Handle errors
    writeToLog(error);

    return 'Not implemented'; // TODO Return the error message
  }

  async getCaptcha(): Promise<GetCaptchaResponse | undefined> {
    try {
      return await this.instance?.getCaptcha();
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
      return undefined;
    }
  }

  async savePost(postId: number, save: boolean): Promise<void> {
    try {
      await this.instance?.savePost({
        post_id: postId,
        save,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
    }
  }

  async likePost(postId: number, vote: ILemmyVote): Promise<void> {
    let oldValues = {
      score: 0,
      upvotes: 0,
      downvotes: 0,
    };

    usePostStore.setState((state) => {
      const post = state.posts.get(postId);

      if (post == null) return;

      oldValues = {
        score: post.view.counts.score,
        upvotes: post.view.counts.upvotes,
        downvotes: post.view.counts.downvotes,
      };

      if (post.view.my_vote === 1 && vote === 0) {
        post.view.counts.score = post.view.counts.score - 1;
        post.view.counts.upvotes = post.view.counts.upvotes - 1;
      } else if (post.view.my_vote === 1) {
        post.view.counts.score = post.view.counts.score - 2;
        post.view.counts.upvotes = post.view.counts.upvotes - 1;
        post.view.counts.downvotes = post.view.counts.downvotes + 1;
      } else if (post.view.my_vote === -1 && vote === 0) {
        post.view.counts.score = post.view.counts.score + 1;
        post.view.counts.upvotes = post.view.counts.downvotes - 1;
      } else if (post.view.my_vote === -1) {
        post.view.counts.score = post.view.counts.score + 2;
        post.view.counts.upvotes = post.view.counts.upvotes + 1;
        post.view.counts.downvotes = post.view.counts.downvotes - 1;
      } else if (post.view.my_vote === 0 || post.view.my_vote === undefined) {
        if (vote === 1) {
          post.view.counts.score = post.view.counts.score + 1;
          post.view.counts.upvotes = post.view.counts.upvotes + 1;
        } else {
          post.view.counts.score = post.view.counts.score - 1;
          post.view.counts.upvotes = post.view.counts.downvotes + 1;
        }
      }
    });

    try {
      await this.instance?.likePost({
        post_id: postId,
        score: vote,
      });
    } catch (e: any) {
      usePostStore.setState((state) => {
        const post = state.posts.get(postId);

        if (post == null) return;

        post.view.counts.score = oldValues.score;
        post.view.counts.upvotes = oldValues.upvotes;
        post.view.counts.downvotes = oldValues.downvotes;
      });

      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async likeComment(commentId: number, score: ILemmyVote): Promise<void> {
    try {
      await this.instance?.likeComment({
        comment_id: commentId,
        score,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
    }
  }

  async saveComment(commentId: number, save: boolean): Promise<void> {
    try {
      await this.instance?.saveComment({
        comment_id: commentId,
        save,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
    }
  }

  async getSite(): Promise<GetSiteResponse | undefined> {
    try {
      return await this.instance?.getSite();
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
      return undefined;
    }
  }

  async getUnreadCount(): Promise<GetUnreadCountResponse | undefined> {
    try {
      return await this.instance?.getUnreadCount();
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
      return undefined;
    }
  }

  async getPersonDetails(
    username: string,
  ): Promise<GetPersonDetailsResponse | undefined> {
    try {
      return await this.instance?.getPersonDetails({
        username,
        sort: 'New',
        limit: 50,
        page: 1,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
      return undefined;
    }
  }

  async getCommunity(name: string): Promise<GetCommunityResponse | undefined> {
    try {
      return await this.instance?.getCommunity({
        name,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
      return undefined;
    }
  }

  async getReplies(
    page = 1,
    limit = 50,
  ): Promise<GetRepliesResponse | undefined> {
    try {
      return await this.instance?.getReplies({
        page,
        limit,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
      return undefined;
    }
  }

  async getPosts(
    feedId: string,
    options: IGetPostOptions = {},
    addToFeed = true,
  ): Promise<GetPostsResponse | undefined> {
    // Get settings
    const settings = useSettingsStore.getState();

    // Define default options
    const defaultOptions: IGetPostOptions = {
      limit: 50,
      page: 1,
      type: settings.defaultListingType,
      sort:
        // TODO This should use a separate option for feed vs community
        options.communityId != null || options.communityName != null
          ? settings.defaultSort
          : settings.defaultSort,
    };

    // Set all our options
    options = {
      ...defaultOptions,
      ...options,
    };

    // Attempt the request
    try {
      // Get the posts
      const res = await this.instance?.getPosts({
        sort: options.sort,
        type_: options.type,
        limit: options.limit,
        page: options.page,
        community_id: options.communityId,
        community_name: options.communityName,
      });

      // Add them to the feed
      if (res != null && addToFeed) {
        // Create empty array of post ids
        const postIds: number[] = [];

        usePostStore.setState((state) => {
          // Add each post to the state
          for (const post of res.posts) {
            state.posts.set(post.post.id, {
              view: post,
              comments: [],
              usedBy: [],
            });

            postIds.push(post.post.id);
          }
        });

        // Add the post ids to the feed
        useFeedStore.setState((state) => {
          const feed = state.feeds.get(feedId);

          if (feed == null) {
            state.feeds.set(feedId, {
              feedId,
              postIds,
            });
          } else {
            feed.postIds = [...feed.postIds, ...postIds];
          }
        });
      }

      return res;
    } catch (e: any) {
      const errorMsg = ApiInstance.handleError(e.toString());

      throw new Error(errorMsg);
    }
  }

  async getPost(postId: number): Promise<GetPostResponse | undefined> {
    try {
      return await this.instance?.getPost({
        id: postId,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
      return undefined;
    }
  }

  async getComments(postId: number): Promise<GetCommentsResponse | undefined> {
    try {
      return await this.instance?.getComments({
        post_id: postId,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
      return undefined;
    }
  }

  async listCommunities(
    page = 1,
    limit = 50,
  ): Promise<ListCommunitiesResponse | undefined> {
    try {
      return await this.instance?.listCommunities({
        page,
        limit,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
      return undefined;
    }
  }

  async markPostRead(postId: number): Promise<void> {
    try {
      await this.instance?.markPostAsRead({
        post_id: postId,
        read: true,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
    }
  }

  async subscribeCommunity(
    communityId: number,
    subscribe: boolean,
  ): Promise<void> {
    try {
      await this.instance?.followCommunity({
        community_id: communityId,
        follow: subscribe,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
    }
  }

  async reportComment(commentId: number, reason: string): Promise<void> {
    try {
      await this.instance?.createCommentReport({
        comment_id: commentId,
        reason,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
    }
  }

  async reportPost(postId: number, reason: string): Promise<void> {
    try {
      await this.instance?.createPostReport({
        post_id: postId,
        reason,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
    }
  }

  async blockUser(userId: number, block: boolean): Promise<void> {
    try {
      await this.instance?.blockPerson({
        person_id: userId,
        block,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
    }
  }

  async blockCommunity(communityId: number, block: boolean): Promise<void> {
    try {
      await this.instance?.blockCommunity({
        community_id: communityId,
        block,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
    }
  }

  async editComment(commentId: number, content: string): Promise<void> {
    try {
      await this.instance?.editComment({
        comment_id: commentId,
        content,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
    }
  }

  async createComment(
    postId: number,
    content: string,
  ): Promise<CommentResponse | undefined> {
    try {
      return await this.instance?.createComment({
        post_id: postId,
        content,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
      return undefined;
    }
  }

  async createPost(
    options: ICreatePostOptions,
  ): Promise<PostResponse | undefined> {
    try {
      return await this.instance?.createPost({
        name: options.title,
        body: options.body,
        url: options.url,
        language_id: options.languageId ?? 0, // TODO Fix this
        community_id: options.communityId,
        nsfw: options.nsfw,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
      return undefined;
    }
  }

  async deleteComment(commentId: number): Promise<void> {
    try {
      await this.instance?.deleteComment({
        comment_id: commentId,
        deleted: true,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
    }
  }

  async deletePost(postId: number): Promise<void> {
    try {
      await this.instance?.deletePost({
        post_id: postId,
        deleted: true,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
    }
  }
}

export default ApiInstance;
