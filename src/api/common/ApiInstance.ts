import {
  BanFromCommunity,
  BanFromCommunityResponse,
  CommentResponse,
  CommunityResponse,
  CommunityView,
  CreatePost,
  EditPost,
  GetCaptchaResponse,
  GetComments,
  GetCommunityResponse,
  GetPersonDetailsResponse,
  GetPostsResponse,
  GetSiteResponse,
  LemmyHttp,
  ListCommunities,
  ListCommunitiesResponse,
  LocalUser,
  PostResponse,
  RemoveComment,
  RemovePost,
  Search,
  SearchResponse,
} from 'lemmy-js-client';
import { getReadableVersion } from 'react-native-device-info';
import {
  IBlockCommunityParams,
  IBlockPersonParams,
  ICommentParams,
  ICreateCommentParams,
  ICreatePostParams,
  IEditCommentParams,
  IEditPostParams,
  IGetCommentsParams,
  IGetCommunityParams,
  IGetPersonDetailsParams,
  IGetRepliesParams,
  ILikeCommentParams,
  ILikePostParams,
  IPostParams,
  IReportCommentParams,
  IReportPostParams,
  ISignupOptions,
  ISubscribeCommunityParams,
} from '@api/common/types';
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
  addCommunity,
  addOrUpdatePost,
  addPosts,
  addReplies,
  setAllRepliesRead,
  setCommentSaved,
  setCommentScores,
  setPostRead,
  setPostSaved,
  setPostScores,
  setReplyRead,
  setSubscribed,
  setSubscriptions,
  setToast,
  setUnread,
  updateComment,
  useDataStore,
  useSettingsStore,
} from '@src/state';
import { ICommentInfo, lemmyErrors } from '@src/types';
import { updatePost } from '@src/state/data/post/actions/updatePost';

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

  initialized: boolean = false;

  authToken: string | null = null;

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

    // Find the applicable error
    let lemmyError = lemmyErrors.find((e) => e.code === error);

    // If the error is not found, just set it to the unknown error type
    if (lemmyError == null) {
      lemmyError = lemmyErrors[0];
    }

    // Display athe error to the user
    setToast({
      text: lemmyError.message,
      color: '$warn',
    });

    // Return the error incase we use it
    return lemmyError.code;
  }

  /**
   * Get the site information
   * @returns {Promise<GetSiteResponse>}
   */
  async getSite(): Promise<GetSiteResponse> {
    try {
      return await this.instance!.getSite({
        auth: this.authToken!,
      });
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  /**
   * Get a captcha from the site
   * @returns {Promise<GetCaptchaResponse>}
   */
  async getCaptcha(): Promise<GetCaptchaResponse> {
    try {
      return await this.instance!.getCaptcha();
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString);
      throw new Error(errMsg);
    }
  }

  /**
   * Save a post and update the store
   * @param {number} postId
   * @returns {Promise<void>}
   */
  async savePost({ postId }: IPostParams): Promise<void> {
    try {
      // Find the post in the store
      const post = useDataStore.getState().posts.get(postId);

      // If the post is not found, just return
      if (post == null) return;

      // Set the post to saved
      setPostSaved({ postId });

      // Submit the request
      await this.instance!.savePost({
        post_id: postId,
        save: !post.view.saved,
        auth: this.authToken!,
      });
    } catch (e: any) {
      // Revert the change if the save fails
      setPostSaved({ postId });

      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  /**
   * Like a post. This will update the store as well as mark the post as read if the setting is enabled
   * @param {number} postId
   * @param {ILemmyVote} vote
   * @returns {Promise<void>}
   */
  async likePost({ postId, vote }: ILikePostParams): Promise<void> {
    // Find the post in the store
    const post = useDataStore.getState().posts.get(postId)?.view;

    // Return if the post is not found
    if (post == null) return;

    const { counts, my_vote: myVote } = post;
    const { score, upvotes, downvotes } = counts;

    const oldVms = {
      score,
      upvotes,
      downvotes,
      myVote,
      newVote: vote,
    };

    // Calculate the new values
    const newVms = voteCalculator(oldVms);

    // Set the new scores
    setPostScores({
      postId,
      scores: newVms,
    });

    try {
      // Submit the read request as well if we need to
      const markReadOnVote = useSettingsStore.getState().readOptions.onVote;
      if (markReadOnVote) {
        setPostRead({
          postId,
        });
      }

      // Submit the request
      await this.instance!.likePost({
        auth: this.authToken!,
        post_id: postId,
        score: newVms.newVote!,
      });
    } catch (e: any) {
      // Revert the changes if the request fails
      setPostScores({
        postId,
        scores: oldVms,
      });

      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  /**
   * Like a comment without updating the store
   * @param {number} commentId
   * @param {ILemmyVote} vote
   * @returns {Promise<void>}
   */
  async likeCommentWithoutUpdate({
    commentId,
    vote,
  }: ILikeCommentParams): Promise<void> {
    try {
      await this.instance!.likeComment({
        comment_id: commentId,
        score: vote,
        auth: this.authToken!,
      });
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  /**
   * Likes a comment and updates the store.
   * @param {number} commentId
   * @param {ILemmyVote} vote
   * @returns {Promise<void>}
   */
  async likeComment({ commentId, vote }: ILikeCommentParams): Promise<void> {
    const comment = useDataStore.getState().comments.get(commentId);

    if (comment == null) return;

    const { counts, my_vote: myVote } = comment.view;
    const { score, upvotes, downvotes } = counts;

    // Save the old values
    const oldVms = {
      score,
      upvotes,
      downvotes,
      myVote,
      newVote: vote,
    };

    // Calculate the new values and set them
    const newVms = voteCalculator(oldVms);
    setCommentScores({
      commentId,
      scores: newVms,
    });

    try {
      // Try to like the comment
      await this.instance!.likeComment({
        comment_id: commentId,
        score: newVms.newVote!,
        auth: this.authToken!,
      });
    } catch (e: any) {
      // Revert the changes if the request fails
      setCommentScores({
        commentId,
        scores: oldVms,
      });

      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  /**
   * Saves a comment and updates the store
   * @param {number} commentId
   * @returns {Promise<void>}
   */
  async saveComment({ commentId }: ICommentParams): Promise<void> {
    const comment = useDataStore.getState().comments.get(commentId);
    if (comment == null) return;

    setCommentSaved({ commentId });

    try {
      await this.instance!.saveComment({
        comment_id: commentId,
        save: !comment.view.saved,
        auth: this.authToken!,
      });
    } catch (e: any) {
      setCommentSaved({ commentId });

      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  /**
   * Retrieves the unread count from the server and updates the store
   * @returns {Promise<number>}
   */
  async getUnreadCount(): Promise<number> {
    try {
      const res = await this.instance!.getUnreadCount({
        auth: this.authToken!,
      });

      const total = res.replies + res.mentions;

      setUnread(total);

      return total;
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async getPersonDetails({
    usernameOrId,
    page = 1,
    sort,
  }: IGetPersonDetailsParams): Promise<GetPersonDetailsResponse> {
    try {
      return await this.instance!.getPersonDetails({
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

  /**
   * Gets a community from the server and adds it to the store
   * @param {string} name
   * @param {boolean} addToStore - Only add to the store if we want to. Defaults to true.
   * @returns {Promise<GetCommunityResponse | number>}
   */
  async getCommunity({
    communityName,
    addToStore = true,
  }: IGetCommunityParams): Promise<GetCommunityResponse | number> {
    try {
      const res = await this.instance!.getCommunity({
        name: communityName,
        auth: this.authToken!,
      });

      if (!addToStore) return res;

      addCommunity({
        communityResponse: res,
      });

      return res.community_view.community.id;
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString);
      throw new Error(errMsg);
    }
  }

  /**
   * Get a user's post and comment replies.
   * @param {boolean} unreadOnly - Default false
   * @param {number} page - Default 1
   * @param {number} limit - Default 50
   * @returns {Promise<void>}
   */
  async getReplies({
    unreadOnly = false,
    page = 1,
    limit = 50,
  }: IGetRepliesParams): Promise<void> {
    try {
      const res = await this.instance!.getReplies({
        page,
        limit,
        unread_only: unreadOnly,
        auth: this.authToken!,
        sort: 'New',
      });

      addReplies({
        replies: res.replies,
        type: 'reply',
      });
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  /**
   * Get a user's post and comment replies.
   * @param {boolean} unreadOnly - Default false
   * @param {number} page - Default 1
   * @param {number} limit - Default 50
   * @returns {Promise<void>}
   */
  async getMentions({
    unreadOnly = false,
    page = 1,
    limit = 50,
  }: IGetRepliesParams): Promise<void> {
    try {
      const res = await this.instance!.getPersonMentions({
        page,
        limit,
        auth: this.authToken!,
        unread_only: unreadOnly,
        sort: 'New',
      });

      addReplies({
        replies: res.mentions,
        type: 'mention',
      });
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  /**
   * Get posts from a community or the main feed
   * @param {string} feedId
   * @param {IGetPostOptions} options
   * @param {boolean} addToFeed
   * @returns {Promise<GetPostsResponse | undefined>}
   */
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
      refresh: false,
    };

    // Set all our options
    options = {
      ...defaultOptions,
      ...options,
    };

    // Attempt the request
    try {
      // Get the posts
      const res = await this.instance!.getPosts({
        auth: this.authToken!,
        sort: options.sort,
        type_: options.type,
        limit: options.limit,
        page: options.page,
        community_id: options.communityId,
        community_name: options.communityName,
      });

      // Add them to the feed
      if (addToFeed) {
        addPosts({
          posts: res.posts,
          screenId: feedId,
          page: options.page,
          refresh: options.refresh,
        });
        return undefined;
      }

      return res;
    } catch (e: any) {
      const errorMsg = ApiInstance.handleError(e.toString());

      throw new Error(errorMsg);
    }
  }

  /**
   * Get a single post and add it to the store
   * @param {number} postId
   * @returns {Promise<GetPostResponse>}
   */
  async getPost({ postId }: IPostParams): Promise<void> {
    try {
      const res = await this.instance!.getPost({
        id: postId,
        auth: this.authToken!,
      });

      addOrUpdatePost({
        post: res.post_view,
      });
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());

      throw new Error(errMsg);
    }
  }

  /**
   * Get comments
   * @param {Partial<GetComments>} options
   * @param {boolean} addToPost
   * @returns {Promise<ICommentInfo[] | null>}
   */
  async getComments({
    options,
    addToPost = true,
  }: IGetCommentsParams): Promise<ICommentInfo[] | null> {
    const post = useDataStore.getState().posts.get(options.post_id!);

    if (addToPost && post == null) return null;

    const defaultOptions: Partial<GetComments> = {
      auth: this.authToken!,
      max_depth: 8,
    };

    options = {
      ...defaultOptions,
      ...options,
    };

    try {
      const res = await this.instance!.getComments(options as GetComments);

      const builtComments = buildCommentChains(res.comments);

      addComments({
        comments: res.comments,
        postId: options.post_id ?? undefined,
      });

      if (addToPost) {
        addCommentsToPost({
          postId: options.post_id!,
          commentInfo: builtComments.commentInfo,
        });
      }

      return builtComments.commentInfo;
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  /**
   * Mark a post as read and update the store
   * @param {number} postId
   * @returns {Promise<void>}
   */
  async markPostRead({ postId }: IPostParams): Promise<void> {
    try {
      await this.instance!.markPostAsRead({
        post_id: postId,
        read: true,
        auth: this.authToken!,
      });

      setPostRead({ postId });
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString);
      throw new Error(errMsg);
    }
  }

  /**
   * Subscribe to a community and update the store
   * @param {number} communityId
   * @param {boolean} subscribe
   * @returns {Promise<CommunityResponse>}
   */
  async subscribeCommunity({
    communityId,
    subscribe,
  }: ISubscribeCommunityParams): Promise<CommunityResponse> {
    setSubscribed({
      communityId,
      subscribed: subscribe ? 'Subscribed' : 'NotSubscribed',
    });

    try {
      const res = await this.instance!.followCommunity({
        community_id: communityId,
        follow: subscribe,
        auth: this.authToken!,
      });

      return res;
    } catch (e: any) {
      setSubscribed({
        communityId,
        subscribed: !subscribe ? 'Subscribed' : 'NotSubscribed',
      });
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async reportComment({
    commentId,
    reason,
  }: IReportCommentParams): Promise<void> {
    try {
      await this.instance!.createCommentReport({
        comment_id: commentId,
        reason,
        auth: this.authToken!,
      });

      setToast({
        text: 'Comment reported successfully!',
      });
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString);
      throw new Error(errMsg);
    }
  }

  async reportPost({ postId, reason }: IReportPostParams): Promise<void> {
    try {
      await this.instance!.createPostReport({
        post_id: postId,
        reason,
        auth: this.authToken!,
      });

      setToast({
        text: 'Post reported successfully!',
      });
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async blockPerson({ personId, block }: IBlockPersonParams): Promise<void> {
    try {
      const res = await this.instance!.blockPerson({
        person_id: personId,
        block,
        auth: this.authToken!,
      });

      useDataStore.setState((state) => {
        const myUser = state.site.site?.my_user;

        if (myUser == null) return;

        const index = myUser.person_blocks.findIndex(
          (b) => b.person.id === personId,
        );

        if (block) {
          if (index === -1) {
            myUser.person_blocks = [
              ...myUser.person_blocks,
              {
                person: res.person_view.person,
                target: res.person_view.person,
              },
            ];
          }
        } else {
          myUser.person_blocks = myUser.person_blocks?.filter(
            (b) => b.target.id !== personId,
          );
        }
      });
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async blockCommunity({
    communityId,
    block,
  }: IBlockCommunityParams): Promise<void> {
    try {
      const res = await this.instance!.blockCommunity({
        community_id: communityId,
        block,
        auth: this.authToken!,
      });

      useDataStore.setState((state) => {
        const community = state.communities.get(communityId);
        const myUser = state.site.site?.my_user;

        if (community != null) {
          community.community_view.blocked = res.blocked;
        }

        if (myUser == null) return;

        const index = myUser.community_blocks.findIndex(
          (b) => b.community.id === communityId,
        );

        if (block) {
          if (index === -1) {
            myUser.community_blocks = [
              ...myUser.community_blocks,
              {
                person: state.site.site!.my_user!.local_user_view.person,
                community: res.community_view.community,
              },
            ];
          }
        } else {
          myUser.community_blocks = myUser.community_blocks?.filter(
            (b) => b.community.id !== communityId,
          );
        }
      });
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async editComment({ commentId, content }: IEditCommentParams): Promise<void> {
    try {
      const res = await this.instance!.editComment({
        comment_id: commentId,
        content,
        auth: this.authToken!,
      });

      updateComment({
        comment: res.comment_view,
      });
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString);
      throw new Error(errMsg);
    }
  }

  async editPost({ options }: IEditPostParams): Promise<void> {
    options = {
      auth: this.authToken!,
      ...options,
    };

    try {
      const res = await this.instance!.editPost(options as EditPost);

      updatePost({ post: res.post_view });
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async createComment({
    postId,
    content,
    parentId,
  }: ICreateCommentParams): Promise<CommentResponse> {
    try {
      const res = await this.instance!.createComment({
        post_id: postId,
        parent_id: parentId,
        content,
        auth: this.authToken!,
      });

      addComment({
        comment: res.comment_view,
      });

      return res;
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async createPost({ options }: ICreatePostParams): Promise<PostResponse> {
    try {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const res = await this.instance!.createPost({
        auth: this.authToken!,
        ...options,
      } as CreatePost);

      addOrUpdatePost({
        post: res.post_view,
      });

      return res;
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString);
      throw new Error(errMsg);
    }
  }

  async deleteComment({ commentId }: ICommentParams): Promise<void> {
    try {
      const res = await this.instance!.deleteComment({
        comment_id: commentId,
        deleted: true,
        auth: this.authToken!,
      });

      updateComment({
        comment: res.comment_view,
      });
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async deletePost({ postId }: IPostParams): Promise<void> {
    try {
      const res = await this.instance!.deletePost({
        post_id: postId,
        deleted: true,
        auth: this.authToken!,
      });

      updatePost({ post: res.post_view });
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString());
      throw new Error(errMsg);
    }
  }

  async search(searchOptions: Search): Promise<SearchResponse> {
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
      return await this.instance!.search(searchOptions);
    } catch (e: any) {
      const errMsg = ApiInstance.handleError(e.toString);
      throw new Error(errMsg);
    }
  }

  async listCommunities(
    options?: ListCommunities,
  ): Promise<ListCommunitiesResponse> {
    options = {
      auth: this.authToken!,
      sort: 'TopDay',
      limit: 15,
      ...options,
    };

    try {
      return await this.instance!.listCommunities(options);
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
      const res = await this.instance!.removeComment(options as RemoveComment);

      updateComment({
        comment: res.comment_view,
      });

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

      updatePost({ post: res.post_view });

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
      setAllRepliesRead();
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

      setReplyRead({ itemId: replyId, type: 'reply' });
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

      setReplyRead({ itemId: mentionId, type: 'mention' });
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
    // We have to get the user avatar here because if we don't send the user avatar with the request it will fail.
    const userAvatar =
      useDataStore.getState().site.site?.my_user?.local_user_view.person.avatar;

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
