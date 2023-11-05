import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { IReplyNotification } from '@src/types';
import { NavigationContainerRefWithCurrent } from '@react-navigation/core';
import instance from '@src/Instance';
import { preloadPost } from '@helpers/post';

export const useNotificationsObserver = (
  navigation: NavigationContainerRefWithCurrent<any>,
): void => {
  useEffect(() => {
    let isMounted = true;

    const navigate = async (
      notification: Notifications.Notification,
    ): Promise<void> => {
      // We want to wait for initialization. Let's check the instance before we try and retry if necessary
      if (!instance.initialized) {
        setTimeout(async () => await navigate(notification), 1000);
        return;
      }
      // Get the data from the notification
      // @ts-expect-error This is valid but not typed properly
      const data = notification.request.trigger.payload as IReplyNotification;

      const preloadRes = await preloadPost(data.postId);

      if (!preloadRes) return;

      // Navigate to the post screen with the correct comment parent ID
      navigation.navigate('Home', {
        screen: 'Post',
        params: {
          postId: data.postId,
          parentCommentId: data.commentId,
        },
      });
    };

    // Get the last notification response if we are just launching the app
    void Notifications.getLastNotificationResponseAsync().then((res) => {
      if (!isMounted || res?.notification == null) return;

      void navigate(res.notification);
    });

    // Get any future notification responses after the app has launched
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (res) => {
        void navigate(res.notification);
      },
    );

    // Unsubscribe
    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
};
