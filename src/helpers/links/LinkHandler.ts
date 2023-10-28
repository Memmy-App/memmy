import { writeToLog } from '@src/helpers';
import { openLink } from '@helpers/links/openLink';
import { LemmyHttp } from 'lemmy-js-client';
import { getBaseUrl } from '@helpers/links/getBaseUrl';
import { getReadableVersion } from 'react-native-device-info';
import { setAppLoading, useAccountStore } from '@src/state';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import instance from '@src/Instance';

const lemmyLinkRegex = /\/post\/|\/c\/|\/u\/|\/comment\//;

export class LinkHandler {
  link?: string;
  color: string;
  navigation: NativeStackNavigationProp<any>;
  client?: LemmyHttp;

  lemmyHeaders = {
    'User-Agent': `Memmy ${getReadableVersion()}`,
  };

  constructor(
    link: string | undefined,
    color: string,
    navigation: NativeStackNavigationProp<any>,
  ) {
    this.link = link;
    this.color = color;
    this.navigation = navigation;
  }

  public readonly handleLink = async (): Promise<boolean> => {
    // Incase we have no link, we will just return
    if (this.link == null) {
      writeToLog('Invalid link encountered.');
      return true;
    }

    // First we want to see if we need to bother going through the process of checking Lemmy.
    // Let's see if we can rule this out as being a lemmy link
    if (!lemmyLinkRegex.test(this.link)) {
      openLink(this.link, this.color);
      return true;
    }

    // We can now move on to checking the link
    return await this.checkIsLemmy();
  };

  private readonly checkIsLemmy = async (): Promise<boolean> => {
    // Get the base URL
    const baseUrl = getBaseUrl(this.link);

    // Let's check if this is on our own instance. If it is, we can just proceed to opening the link
    const currentInstance = useAccountStore.getState().currentAccount!.instance;

    if (currentInstance.toLowerCase() === baseUrl.toLowerCase()) {
      // Proceed
      this.client = instance.instance!;
      return await this.getContent(true);
    }

    // We are about to do some work so let's show the loading screen
    setAppLoading(true);

    // Create a LemmyHttp instance
    this.client = new LemmyHttp(`https://${baseUrl}`, {
      fetchFunction: undefined,
      headers: this.lemmyHeaders,
    });

    // Now we can query the instance to see if we get a valid response
    try {
      await this.client.getSite();
    } catch (e: any) {
      // We received an error, so this is not a lemmy instance
      setAppLoading(false);
      return false;
    }

    // We know this is a lemmy instance, so now we will proceed to search the instance
    return await this.getContent();
  };

  private readonly getContent = async (isLocal?: boolean): Promise<boolean> => {
    const urlArr = this.link!.split('//')[1].split('/');

    const [instance, endpoint, idOrName] = urlArr;

    // First let's parse the URL
    switch (endpoint) {
      case 'c': {
        // We don't have to actually do anything special for community. Just proceed to open it.
        this.openCommunity(
          idOrName.includes('@') ? idOrName : `${idOrName}@${instance}`,
        );
        setAppLoading(false);
        return true;
      }
      case 'u': {
        // We also don't need to do anything for users.
        this.openUser(
          idOrName.includes('@') ? idOrName : `${idOrName}@${instance}`,
        );
        setAppLoading(false);
        return true;
      }
      case 'post': {
        // If this is local we can just proceed to the post
        if (isLocal === true) {
          return await this.openPost(Number(idOrName));
        }

        // Get the post ID hopefully
        const postId = await this.getPostId(idOrName);

        // Stop loading

        // Return false if we couldn't find one
        if (postId == null) {
          setAppLoading(false);
          return false;
        }

        // Open the post
        return await this.openPost(postId);
      }
      case 'comment': {
        // If this is local we can just proceed to the post
        if (isLocal === true) {
          // If it's local we need to grab the comment first
          const commentRes = await this.client!.getComment({
            id: Number(idOrName),
          });

          return await this.openComment([
            commentRes.comment_view.post.id,
            commentRes.comment_view.comment.id,
          ]);
        }

        // Get the post ID hopefully
        const commentIds = await this.getCommentId(idOrName);

        if (commentIds == null) {
          setAppLoading(false);
          return false;
        }

        // Open the post
        return await this.openComment(commentIds);
      }
      default: {
        return false;
      }
    }
  };

  /**
   * Holy...this worked the first time?
   */
  private readonly getPostId = async (
    postIdStr: string,
  ): Promise<number | null> => {
    try {
      const res = await this.client!.getPost({
        id: Number(postIdStr),
      });

      // Now that we have the post we need to search for it locally. This is a "best we can do" sort of thing.
      const searchRes = await instance.search({
        type_: 'Posts',
        limit: 1,
        q: res.post_view.post.name,
        community_name: `${res.community_view.community.name}@${getBaseUrl(
          res.community_view.community.actor_id,
        )}`,
      });

      if (searchRes.posts.length < 1) {
        return null;
      }

      return searchRes.posts[0].post.id;
    } catch (e: any) {
      return null;
    }
  };

  private readonly getCommentId = async (
    postIdStr: string,
  ): Promise<number[] | null> => {
    try {
      const res = await this.client!.getComment({
        id: Number(postIdStr),
      });

      // Now that we have the post we need to search for it locally. This is a "best we can do" sort of thing.
      const searchRes = await instance.search({
        type_: 'Comments',
        limit: 1,
        // This is super sketchy and I'm not sure the efficacy of it. Hopefully we can find a better solution?
        q: res.comment_view.comment.content.slice(0, 50),
        community_name: `${res.comment_view.community.name}@${getBaseUrl(
          res.comment_view.community.actor_id,
        )}`,
      });

      if (searchRes.comments.length < 1) {
        return null;
      }

      return [searchRes.comments[0].post.id, searchRes.comments[0].comment.id];
    } catch (e: any) {
      return null;
    }
  };

  private readonly openPost = async (postId: number): Promise<boolean> => {
    setAppLoading(true);

    try {
      await instance.getPost(postId);

      // Send to the post
      this.navigation.push('Post', {
        postId,
      });

      setAppLoading(false);
      return true;
    } catch (e) {
      setAppLoading(false);
      return false;
    }
  };

  private readonly openCommunity = (name: string): void => {
    this.navigation.push('Community', {
      name,
    });
  };

  private readonly openUser = (name: string): void => {
    this.navigation.push('Profile', {
      fullName: name,
    });
  };

  private readonly openComment = async (ids: number[]): Promise<boolean> => {
    setAppLoading(true);

    try {
      await instance.getPost(ids[0]);

      // Send to the post
      this.navigation.push('Post', {
        postId: ids[0],
        parentCommentId: ids[1],
      });

      setAppLoading(false);
      return true;
    } catch (e) {
      setAppLoading(false);
      return false;
    }
  };
}
