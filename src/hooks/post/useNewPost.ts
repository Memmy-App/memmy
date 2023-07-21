import React, { useRef, useState } from "react";
import { Alert, TextInput } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { CreatePost } from "lemmy-js-client";
import { useTranslation } from "react-i18next";
import { useRoute } from "@react-navigation/core";
import { useAppDispatch } from "../../../store";
import { selectImage } from "../../helpers/ImageHelper";
import uploadToImgur from "../../helpers/ImgurHelper";
import { writeToLog } from "../../helpers/LogHelper";
import { lemmyAuthToken, lemmyInstance } from "../../LemmyInstance";
import { setPost } from "../../slices/post/postSlice";
import { handleLemmyError } from "../../helpers/LemmyErrorHelper";
import {
  useCommunity,
  useCommunityLanguages,
} from "../../stores/communities/communitiesStore";

interface UseNewPost {
  loading;
  error;

  form: {
    body: string;
    name: string;
    url: string;
    nsfw: boolean;
  };

  inputRef: React.MutableRefObject<TextInput>;

  onFormChange: (name: string, value: string | boolean) => void;

  doUpload: () => Promise<void>;
  doSubmit: () => Promise<void>;
}

const useNewPost = (): UseNewPost => {
  const { t } = useTranslation();
  // State
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const { communityFullName } = useRoute<any>().params;
  const community = useCommunity(communityFullName);
  const languages = useCommunityLanguages(communityFullName);

  const [form, setForm] = useState({
    body: "",
    name: "",
    url: "",
    nsfw: false,
  });

  // Refs
  const inputRef = useRef<TextInput>();

  // Other hooks
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();

  const onFormChange = (name: string, value: string | boolean) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const doUpload = async () => {
    setError(undefined);
    let path;

    try {
      path = await selectImage();
    } catch (e) {
      if (e === "permissions") {
        Alert.alert(
          t("alert.title.permissionsError"),
          t("alert.message.allowCameraRoll")
        );
      }

      return;
    }

    setLoading(true);

    let imgurLink;

    try {
      imgurLink = await uploadToImgur(path);
    } catch (e) {
      writeToLog("Error uploading image.");
      writeToLog(e.toString());

      setLoading(false);
      setError(e.toString());
      Alert.alert(t("alert.title.error"), t("alert.message.imgurUploadError"));
    }

    onFormChange("url", imgurLink);
    setLoading(false);
  };

  const doSubmit = async () => {
    try {
      setLoading(true);
      setError(undefined);

      const prepared: CreatePost = {
        ...form,
        name: form.name !== "" ? form.name : undefined,
        body: form.body !== "" ? form.body : undefined,
        url: form.url !== "" ? form.url : undefined,
        auth: lemmyAuthToken,
        language_id: languages.length < 1 ? undefined : languages[0],
        community_id: community.community.id,
        nsfw: form.nsfw,
      };

      const res = await lemmyInstance.createPost(prepared);

      setLoading(false);

      dispatch(setPost(res.post_view));

      navigation.pop();
    } catch (e) {
      setLoading(false);
      setError(e.toString());

      handleLemmyError(e.toString());
    }
  };

  return {
    loading,
    error,

    form,

    inputRef,

    onFormChange,

    doUpload,
    doSubmit,
  };
};

export default useNewPost;
