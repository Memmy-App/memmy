import { setAppLoading } from '@src/state';
import instance from '@src/Instance';

export const preloadPost = async (postId: number): Promise<boolean> => {
  setAppLoading(true);

  try {
    await instance.getPost({ postId: postId ?? 0 });
  } catch (e: any) {
    setAppLoading(false);
    return false;
  }

  setAppLoading(false);
  return true;
};
