import {
  BanFromCommunity,
  BanFromCommunityResponse,
  CommentResponse,
  CommunityResponse,
  CommunityView,
  CreatePost,
  GetCaptchaResponse,
  GetComments,
  GetCommunityResponse,
  GetPersonDetailsResponse,
  GetPostResponse,
  GetPostsResponse,
  GetSiteResponse,
  GetUnreadCountResponse,
  LemmyHttp,
  ListCommunities,
  ListCommunitiesResponse,
  LocalUser,
  PostResponse,
  RemoveComment,
  RemovePost,
  Search,
  SearchResponse,
  SortType,
} from 'lemmy-js-client';
import { getReadableVersion } from 'react-native-device-info';
import { ISignupOptions } from '@api/common/types';
import { getBaseUrl } from '@helpers/links/getBaseUrl';
import { writeToLog } from '@helpers/LogHelper';
import ApiOptions from '@api/common/types/IApiOptions';
import { ILemmyVote } from '@api/lemmy/types';
import IGetPostOptions from '@api/common/types/IGetPostOptions';
import { buildCommentChains } from '@helpers/comments';
import { voteCalculator } from '@helpers/comments/voteCalculator';
import {
  addComment,
  addComments,
  addCommentsToPost,
  addPost,
  addPosts,
  markPostRead,
  setCommentSaved,
  setSubscribed,
  setSubscriptions,
  setToast,
  setUnread,
  updateComment,
  useCommentStore,
  useCommunityStore,
  usePostStore,
  useSettingsStore,
  useSiteStore,
} from '@src/state';
import { updatePost } from '@src/state/post/actions/updatePost';
import {
  setAllRead,
  setMentionRead,
  setMentions,
  setReplies,
  setReplyRead,
} from '@src/state/inbox/actions';
import { setPostSaved } from '@src/state/post/actions/setPostSaved';
import { ICommentInfo, lemmyErrors } from '@src/types';

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

  isUpdate: boolean = false;

  async initialize(
    options: ApiOptions,
    signup = false,
    signupOptions?: ISignupOptions,
  ): Promise<EInitializeResult> {
    this.username = options.username;
    this.apiType = 'lemmy';

    const headers = {
      'User-Agent': `Memmy ${getReadableVersion()}`,
      ...(options.authToken != null && {
        Authorization: `Bearer ${options.authToken}`,
      }),
    };

    if (options.type === 'lemmy') {
      this.instance = new LemmyHttp(`https://${getBaseUrl(options.host)}`, {
        fetchFunction: undefined,
        headers,
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
            captcha_uuid:
              signupOptions?.captchaUuid != null &&
              signupOptions.captchaUuid !== ''
                ? signupOptions?.captchaUuid
                : undefined,
            captcha_answer:
              signupOptions?.captchaAnswer != null &&
              signupOptions.captchaAnswer !== ''
                ? signupOptions?.captchaAnswer
                : undefined,
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

        await this.initialize({
          ...options,
          authToken: res.jwt,
        });

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
    // Write the error to the log
    writeToLog(error);

    let lemmyError = lemmyErrors.find((e) => e.code === error);

    if (lemmyError == null) {
      lemmyError = lemmyErrors[0];
    }

    setToast({
      text: lemmyError.message,
      color: '$warn',
    });

    return lemmyError.code;
  }

  async getSite(): Promise<GetSiteResponse | undefined> {
    try {
      return await this.instance?.getSite({
        auth: this.authToken!,
      });
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async getCaptcha(): Promise<GetCaptchaResponse | undefined> {
    try {
      return await this.instance?.getCaptcha();
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString);
      throw new Error(errMsg);
    }
  }

  async savePost(postId: number): Promise<void> {
    try {
      const post = usePostStore.getState().posts.get(postId);

      if (post == null) return;

      setPostSaved(postId);

      await this.instance!.savePost({
        post_id: postId,
        save: !post.view.saved,
        auth: this.authToken!,
      });
    } catch (e: any) {
      setPostSaved(postId);

      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async likePost(postId: number, vote: ILemmyVote): Promise<void> {
    const post = usePostStore.getState().posts.get(postId)?.view;

    if (post == null) return;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { counts, my_vote } = post;

    const oldVms = {
      score: counts.score,
      upvotes: counts.upvotes,
      downvotes: counts.downvotes,
      myVote: my_vote,
      newVote: vote,
    };

    const newVms = voteCalculator(oldVms);

    usePostStore.setState((state) => {
      const post = state.posts.get(postId)!;

      post.view.counts.score = newVms.score;
      post.view.counts.upvotes = newVms.upvotes;
      post.view.counts.downvotes = newVms.downvotes;
      post.view.my_vote = newVms.newVote;
    });

    try {
      // Handle marking the post read
      const markReadOnVote = useSettingsStore.getState().readOptions.onVote;

      if (markReadOnVote) {
        markPostRead(postId);
      }

      await this.instance?.likePost({
        post_id: postId,
        score: newVms.newVote!,
        auth: this.authToken!,
      });
    } catch (e: any) {
      usePostStore.setState((state) => {
        const post = state.posts.get(postId);

        if (post == null) return;

        post.view.counts.score = oldVms.score;
        post.view.counts.upvotes = oldVms.upvotes;
        post.view.counts.downvotes = oldVms.downvotes;
      });

      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async likeCommentWithoutUpdate(
    commentId: number,
    vote: ILemmyVote,
  ): Promise<void> {
    try {
      await this.instance?.likeComment({
        comment_id: commentId,
        score: vote,
        auth: this.authToken!,
      });
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async likeComment(commentId: number, vote: ILemmyVote): Promise<void> {
    const comment = useCommentStore.getState().comments.get(commentId);

    if (comment == null) return;

    const { counts, my_vote: myVote } = comment.view;

    const oldVms = {
      score: counts.score,
      upvotes: counts.upvotes,
      downvotes: counts.downvotes,
      myVote,
      newVote: vote,
    };

    const newVms = voteCalculator(oldVms);

    useCommentStore.setState((state) => {
      const comment = state.comments.get(commentId)!;

      comment.view.counts.score = newVms.score;
      comment.view.counts.upvotes = newVms.upvotes;
      comment.view.counts.downvotes = newVms.downvotes;
      comment.view.my_vote = newVms.newVote;
    });

    try {
      await this.instance?.likeComment({
        comment_id: commentId,
        score: newVms.newVote!,
        auth: this.authToken!,
      });
    } catch (e: any) {
      useCommentStore.setState((state) => {
        const comment = state.comments.get(commentId);

        if (comment == null) return;

        comment.view.counts.score = oldVms.score;
        comment.view.counts.upvotes = oldVms.upvotes;
        comment.view.counts.downvotes = oldVms.downvotes;
      });

      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async saveComment(commentId: number): Promise<void> {
    try {
      const comment = useCommentStore.getState().comments.get(commentId);

      if (comment == null) return;

      setCommentSaved(commentId);

      await this.instance!.saveComment({
        comment_id: commentId,
        save: !comment.view.saved,
        auth: this.authToken!,
      });
    } catch (e: any) {
      setCommentSaved(commentId);

      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async getUnreadCount(): Promise<GetUnreadCountResponse> {
    try {
      return await this.instance!.getUnreadCount({
        auth: this.authToken!,
      });
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async getPersonDetails(
    usernameOrId: string | number,
    page = 1,
    sort?: SortType,
  ): Promise<GetPersonDetailsResponse | undefined> {
    try {
      return await this.instance?.getPersonDetails({
        person_id: typeof usernameOrId === 'number' ? usernameOrId : undefined,
        username: typeof usernameOrId === 'string' ? usernameOrId : undefined,
        sort: 'New',
        limit: 20,
        page,
        auth: this.authToken!,
      });
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async getCommunity(
    name: string,
    addToStore = true,
  ): Promise<GetCommunityResponse | undefined | number> {
    try {
      const res = await this.instance?.getCommunity({
        name,
        // @ts-expect-error TODO Remove this later
        auth: this.authToken,
      });

      if (res == null) return undefined;
      if (!addToStore) return res;

      useCommunityStore.setState((state) => {
        state.communities.set(res.community_view.community.id, res);
      });

      return res.community_view.community.id;
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString);
      throw new Error(errMsg);
    }
  }

  async getReplies(unreadOnly = false, page = 1, limit = 50): Promise<void> {
    try {
      const res = await this.instance!.getReplies({
        page,
        limit,
        unread_only: unreadOnly,
        auth: this.authToken!,
        sort: 'New',
      });

      setReplies(res.replies);
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async getMentions(unreadOnly: boolean, page = 1, limit = 50): Promise<void> {
    try {
      const res = await this.instance!.getPersonMentions({
        page,
        limit,
        auth: this.authToken!,
        unread_only: unreadOnly,
        sort: 'New',
      });

      setMentions(res.mentions);
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
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
      limit: 25,
      page: 1,
      type: settings.defaultListingType,
      sort:
        // TODO This should use a separate option for feed vs community
        options.communityId != null || options.communityName != null
          ? settings.defaultSort
          : settings.defaultSort,
      refresh: false,
    };

    // Set all our options
    options = {
      ...defaultOptions,
      sort: settings.defaultSort,
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
        auth: this.authToken!,
      });

      // Add them to the feed
      if (res != null && addToFeed) {
        addPosts(res.posts, feedId, options.page, options.refresh);

        return undefined;
      }

      return res;
    } catch (e: any) {
      const errorMsg = ApiInstance.handleError(e.toString());

      throw new Error(errorMsg);
    }
  }

  async getPost(postId: number): Promise<GetPostResponse> {
    try {
      const res = await this.instance!.getPost({
        id: postId,
        auth: this.authToken!,
      });

      return res;
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());

      throw new Error(errMsg);
    }
  }

  async getComments(
    options: Partial<GetComments>,
    addToPost = true,
  ): Promise<ICommentInfo[] | null> {
    const post = usePostStore.getState().posts.get(options.post_id!);

    if (addToPost && post == null) return null;

    const defaultOptions: Partial<GetComments> = {
      auth: this.authToken!,
      max_depth: 4,
    };

    options = {
      ...defaultOptions,
      ...options,
    };

    try {
      const res = await this.instance!.getComments(options as GetComments);

      const builtComments = buildCommentChains(res.comments);

      addComments(res.comments);

      if (addToPost) {
        addCommentsToPost(options.post_id!, builtComments.commentInfo);
      }

      return builtComments.commentInfo;
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async markPostRead(postId: number): Promise<void> {
    try {
      await this.instance!.markPostAsRead({
        post_id: postId,
        read: true,
        auth: this.authToken!,
      });

      markPostRead(postId);
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString);
      throw new Error(errMsg);
    }
  }

  async subscribeCommunity(
    communityId: number,
    subscribe: boolean,
  ): Promise<CommunityResponse> {
    try {
      const res = await this.instance?.followCommunity({
        community_id: communityId,
        follow: subscribe,
        auth: this.authToken!,
      });

      if (res == null) {
        const errMsg = ApiInstance.handleError('unknown');
        throw new Error(errMsg);
      }

      setSubscribed(communityId, res.community_view.subscribed);

      return res;
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async reportComment(commentId: number, reason: string): Promise<void> {
    try {
      await this.instance?.createCommentReport({
        comment_id: commentId,
        reason,
        auth: this.authToken!,
      });
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString);
      throw new Error(errMsg);
    }
  }

  async reportPost(postId: number, reason: string): Promise<void> {
    try {
      await this.instance?.createPostReport({
        post_id: postId,
        reason,
        auth: this.authToken!,
      });
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async blockUser(userId: number, block: boolean): Promise<void> {
    try {
      await this.instance?.blockPerson({
        person_id: userId,
        block,
        auth: this.authToken!,
      });
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString);
      throw new Error(errMsg);
    }
  }

  async blockCommunity(communityId: number, block: boolean): Promise<void> {
    try {
      await this.instance?.blockCommunity({
        community_id: communityId,
        block,
        auth: this.authToken!,
      });
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString);
      throw new Error(errMsg);
    }
  }

  async editComment(commentId: number, content: string): Promise<void> {
    try {
      await this.instance?.editComment({
        comment_id: commentId,
        content,
        auth: this.authToken!,
      });
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString);
      throw new Error(errMsg);
    }
  }

  async createComment(
    postId: number,
    content: string,
    parentId?: number,
  ): Promise<CommentResponse> {
    try {
      const res = await this.instance?.createComment({
        post_id: postId,
        parent_id: parentId,
        content,
        auth: this.authToken!,
      });

      if (res == null) {
        const errMsg = ApiInstance.handleError('unknown');
        throw new Error(errMsg);
      }

      addComment(res.comment_view);

      return res;
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async createPost(
    options: Partial<CreatePost>,
  ): Promise<PostResponse | undefined> {
    try {
      const defaultOptions: Partial<CreatePost> = {
        auth: this.authToken!,
      };

      options = {
        ...defaultOptions,
        ...options,
      };

      const res = await this.instance?.createPost(options as CreatePost);

      if (res == null) {
        const errMsg = ApiInstance.handleError('unknown');
        throw new Error(errMsg);
      }

      addPost(res.post_view);

      return res;
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString);
      throw new Error(errMsg);
    }
  }

  async deleteComment(commentId: number): Promise<void> {
    try {
      const res = await this.instance?.deleteComment({
        comment_id: commentId,
        deleted: true,
        auth: this.authToken!,
      });

      if (res == null) {
        const errMsg = ApiInstance.handleError('unknown');
        throw new Error(errMsg);
      }

      updateComment(res.comment_view);
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async deletePost(postId: number): Promise<void> {
    try {
      const res = await this.instance!.deletePost({
        post_id: postId,
        deleted: true,
        auth: this.authToken!,
      });

      updatePost(res.post_view);
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async search(searchOptions: Search): Promise<SearchResponse | undefined> {
    const defaultOptions: Search = {
      sort: 'Hot',
      type_: 'All',
      limit: 10,
      auth: this.authToken!,
      q: '',
    };

    searchOptions = {
      ...defaultOptions,
      ...searchOptions,
    };

    try {
      return await this.instance?.search(searchOptions);
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString);
      throw new Error(errMsg);
    }
  }

  async listCommunities(
    options?: ListCommunities,
  ): Promise<ListCommunitiesResponse | undefined> {
    const defaultOptions: ListCommunities = {
      sort: 'TopDay',
      limit: 15,
      auth: this.authToken!,
    };

    options = {
      ...defaultOptions,
      ...options,
    };

    try {
      return await this.instance?.listCommunities(options);
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString);
      throw new Error(errMsg);
    }
  }

  async modBanFromCommunity(
    options: Partial<BanFromCommunity>,
  ): Promise<BanFromCommunityResponse | undefined> {
    const defaultOptions = {
      auth: options.auth ?? this.authToken!,
      ban: true,
    };

    options = {
      ...defaultOptions,
      ...options,
    };

    try {
      return await this.instance?.banFromCommunity(options as BanFromCommunity);
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString);
      throw new Error(errMsg);
    }
  }

  async modRemoveComment(
    options: Partial<RemoveComment>,
  ): Promise<CommentResponse | undefined> {
    const defaultOptions: Partial<RemoveComment> = {
      auth: this.authToken!,
      removed: true,
    };

    options = {
      ...defaultOptions,
      ...options,
    };
    try {
      const res = await this.instance?.removeComment(options as RemoveComment);

      if (res == null) {
        const errMsg = ApiInstance.handleError('unknown');
        throw new Error(errMsg);
      }

      updateComment(res.comment_view);

      return res;
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async modRemovePost(options: Partial<RemovePost>): Promise<PostResponse> {
    const defaultOptions: Partial<RemovePost> = {
      auth: this.authToken!,
      removed: true,
    };

    options = {
      ...defaultOptions,
      ...options,
    };

    try {
      const res = await this.instance!.removePost(options as RemovePost);

      updatePost(res.post_view);

      return res;
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async getSubscriptions(): Promise<CommunityView[]> {
    try {
      let load = true;
      let page = 1;

      let communities: CommunityView[] = [];

      while (load) {
        const res = await this.listCommunities({
          auth: this.authToken!,
          type_: 'Subscribed',
          page,
          limit: 20,
        });

        if (res === undefined) {
          const errMsg = ApiInstance.handleError('unknown');
          throw new Error(errMsg);
        }

        communities = [...communities, ...res.communities];

        if (res.communities.length === 20) {
          page++;
        } else {
          load = false;
        }
      }

      setSubscriptions(communities);

      return communities;
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async markInboxRead(): Promise<void> {
    try {
      await this.instance!.markAllAsRead({
        auth: this.authToken!,
      });

      setUnread(0);
      setAllRead();
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async markReplyRead(replyId: number): Promise<void> {
    try {
      await this.instance!.markCommentReplyAsRead({
        auth: this.authToken!,
        comment_reply_id: replyId,
        read: true,
      });

      setReplyRead(replyId);
      setUnread(true);
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async markMentionRead(mentionId: number): Promise<void> {
    try {
      await this.instance!.markPersonMentionAsRead({
        auth: this.authToken!,
        person_mention_id: mentionId,
        read: true,
      });

      setMentionRead(mentionId);
      setUnread(true);
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async markMessageRead(messageId: number): Promise<void> {
    try {
      await this.instance!.markPrivateMessageAsRead({
        auth: this.authToken!,
        private_message_id: messageId,
        read: true,
      });

      setUnread(true);
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async setUserSetting(setting: keyof LocalUser, value: any): Promise<void> {
    const userAvatar =
      useSiteStore.getState().site?.my_user?.local_user_view.person.avatar;

    try {
      await this.instance!.saveUserSettings({
        auth: this.authToken!,
        avatar: userAvatar ?? '',
        [setting]: value,
      });
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }
}

export default ApiInstance;
