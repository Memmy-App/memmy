import ApiOptions from "@src/types/api/ApiOptions";
import {
  CommentResponse,
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
} from "lemmy-js-client";
import getBaseUrl from "@src/helpers/links/getBaseUrl";
import { getReadableVersion } from "react-native-device-info";
import IGetPostOptions from "@src/types/api/IGetPostOptions";
import ILemmyVote from "@src/types/api/ILemmyVote";
import { writeToLog } from "@src/helpers/debug/DebugHelper";
import ICreatePostOptions from "@src/types/api/ICreatePostOptions";

export enum EInitializeResult {
  SUCCESS,
  PASSWORD,
  TOTP,
}

class ApiInstance {
  apiType: "lemmy" | "kbin";

  authToken: string;

  username: string;

  instance: LemmyHttp | null; // TODO Kbin client will need to be added here

  async initialize(options: ApiOptions): Promise<EInitializeResult> {
    if (options.type === "lemmy") {
      this.instance = new LemmyHttp(getBaseUrl(options.host), {
        fetchFunction: undefined,
        headers: {
          "User-Agent": `Memmy ${getReadableVersion()}`,
        },
      });

      if (options.authToken) {
        this.authToken = options.authToken;

        return EInitializeResult.SUCCESS;
      }

      try {
        const res = await this.instance.login({
          username_or_email: options.username,
          password: options.password!,
          totp_2fa_token: options.totpToken ?? undefined,
        });
        this.authToken = res.jwt ?? "";

        return EInitializeResult.SUCCESS;
      } catch (e: any) {
        this.resetInstance();

        if (e.toString() === "missing_totp_token") {
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
  }

  static handleError(error: string): void {
    // TODO Handle errors
    writeToLog(error);

    throw new Error();
  }

  /** These are all of the endpoints we utilize in the app * */

  async savePost(postId: number, save: boolean): Promise<void> {
    try {
      await this.instance!.savePost({
        auth: this.authToken,
        post_id: postId,
        save,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
    }
  }

  async likePost(postId: number, score: ILemmyVote): Promise<void> {
    try {
      await this.instance!.likePost({
        auth: this.authToken,
        post_id: postId,
        score,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
    }
  }

  async likeComment(commentId: number, score: ILemmyVote): Promise<void> {
    try {
      await this.instance!.likeComment({
        auth: this.authToken,
        comment_id: commentId,
        score,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
    }
  }

  async saveComment(commentId: number, save: boolean): Promise<void> {
    try {
      await this.instance!.saveComment({
        auth: this.authToken,
        comment_id: commentId,
        save,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
    }
  }

  async getSite(): Promise<GetSiteResponse | null> {
    try {
      return await this.instance!.getSite({
        auth: this.authToken,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
      return null;
    }
  }

  async getUnreadCount(): Promise<GetUnreadCountResponse | null> {
    try {
      return await this.instance!.getUnreadCount({
        auth: this.authToken,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
      return null;
    }
  }

  async getPersonDetails(
    username: string
  ): Promise<GetPersonDetailsResponse | null> {
    try {
      return await this.instance!.getPersonDetails({
        auth: this.authToken,
        username,
        sort: "New",
        limit: 50,
        page: 1,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
      return null;
    }
  }

  async getCommunity(name: string): Promise<GetCommunityResponse | null> {
    try {
      return await this.instance!.getCommunity({
        auth: this.authToken,
        name,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
      return null;
    }
  }

  async getReplies(page = 1, limit = 50): Promise<GetRepliesResponse | null> {
    try {
      return await this.instance!.getReplies({
        auth: this.authToken,
        page,
        limit,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
      return null;
    }
  }

  async getPosts(options: IGetPostOptions): Promise<GetPostsResponse | null> {
    // TODO Get defaults from state
    const defaultOptions: IGetPostOptions = {
      sort: "TopTwelveHour",
      limit: 50,
      page: 1,
      type: "All",
    };

    options = {
      ...defaultOptions,
      ...options,
    };

    try {
      return await this.instance!.getPosts({
        auth: this.authToken,
        sort: options.sort,
        type_: options.type,
        limit: options.limit,
        page: options.page,
        community_id: options.communityId,
        community_name: options.communityName,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
      return null;
    }
  }

  async getPost(postId: number): Promise<GetPostResponse | null> {
    try {
      return await this.instance!.getPost({
        auth: this.authToken,
        id: postId,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
      return null;
    }
  }

  async getComments(postId: number): Promise<GetCommentsResponse | null> {
    try {
      return await this.instance!.getComments({
        auth: this.authToken,
        post_id: postId,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
      return null;
    }
  }

  async listCommunities(
    page = 1,
    limit = 50
  ): Promise<ListCommunitiesResponse | null> {
    try {
      return await this.instance!.listCommunities({
        auth: this.authToken,
        page,
        limit,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
      return null;
    }
  }

  async markPostRead(postId: number): Promise<void> {
    try {
      await this.instance!.markPostAsRead({
        auth: this.authToken,
        post_id: postId,
        read: true,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
    }
  }

  async subscribeCommunity(
    communityId: number,
    subscribe: boolean
  ): Promise<void> {
    try {
      await this.instance!.followCommunity({
        auth: this.authToken,
        community_id: communityId,
        follow: subscribe,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
    }
  }

  async reportComment(commentId: number, reason: string): Promise<void> {
    try {
      await this.instance!.createCommentReport({
        auth: this.authToken,
        comment_id: commentId,
        reason,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
    }
  }

  async reportPost(postId: number, reason: string): Promise<void> {
    try {
      await this.instance!.createPostReport({
        auth: this.authToken,
        post_id: postId,
        reason,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
    }
  }

  async blockUser(userId: number, block: boolean): Promise<void> {
    try {
      await this.instance!.blockPerson({
        auth: this.authToken,
        person_id: userId,
        block,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
    }
  }

  async blockCommunity(communityId: number, block: boolean): Promise<void> {
    try {
      await this.instance!.blockCommunity({
        auth: this.authToken,
        community_id: communityId,
        block,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
    }
  }

  async editComment(commentId: number, content: string): Promise<void> {
    try {
      await this.instance!.editComment({
        auth: this.authToken,
        comment_id: commentId,
        content,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
    }
  }

  async createComment(
    postId: number,
    content: string
  ): Promise<CommentResponse | null> {
    try {
      return await this.instance!.createComment({
        auth: this.authToken,
        post_id: postId,
        content,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
      return null;
    }
  }

  async createPost(options: ICreatePostOptions): Promise<PostResponse | null> {
    try {
      return await this.instance!.createPost({
        auth: this.authToken,
        name: options.title,
        body: options.body,
        url: options.url,
        language_id: options.languageId ?? 0, // TODO Fix this
        community_id: options.communityId,
        nsfw: options.nsfw,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
      return null;
    }
  }

  async deleteComment(commentId: number): Promise<void> {
    try {
      await this.instance!.deleteComment({
        auth: this.authToken,
        comment_id: commentId,
        deleted: true,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
    }
  }

  async deletePost(postId: number): Promise<void> {
    try {
      await this.instance!.deletePost({
        auth: this.authToken,
        post_id: postId,
        deleted: true,
      });
    } catch (e: any) {
      ApiInstance.handleError(e.toString());
    }
  }
}

export default ApiInstance;
