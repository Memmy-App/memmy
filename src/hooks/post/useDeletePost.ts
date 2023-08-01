import { lemmyAuthToken, lemmyInstance } from "@src/LemmyInstance";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import { handleLemmyError } from "@src/helpers/LemmyErrorHelper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppDispatch } from "@root/store";
import { showToast } from "@src/slices/toast/toastSlice";
import { useUpdatesStore } from "@src/stores/updates/updatesStore";

const useDeletePost = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();
  const updatesStore = useUpdatesStore();

  return useCallback(async (postId: number, pop = false) => {
    const onDeletePost = async () => {
      try {
        await lemmyInstance.deletePost({
          auth: lemmyAuthToken,
          post_id: postId,
          deleted: true,
        });

        dispatch(
          showToast({
            message: t("toast.postDeleted"),
          })
        );

        if (pop) {
          updatesStore.setPostDeleted(postId);

          navigation.pop();
        }
      } catch (e) {
        handleLemmyError(e.toString());
      }
    };

    Alert.alert(t("alert.title.deletePost"), t("alert.message.deletePost"), [
      {
        text: t("Cancel"),
      },
      {
        text: t("Delete"),
        onPress: onDeletePost,
      },
    ]);
  }, []);
};

export default useDeletePost;
