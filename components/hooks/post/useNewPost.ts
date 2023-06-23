import { useRef, useState } from "react";
import { Alert, TextInput } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { CreatePost } from "lemmy-js-client";
import { useAppDispatch } from "../../../store";
import { selectImage } from "../../../helpers/ImageHelper";
import uploadToImgur from "../../../helpers/ImgurHelper";
import { writeToLog } from "../../../helpers/LogHelper";
import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";
import { setPost } from "../../../slices/post/postSlice";

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

const useNewPost = (communityId: number): UseNewPost => {
  // State
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

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
          "Permissions Error",
          "Please allow Memmy to access your camera roll."
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
      Alert.alert("Error", "Error uploading image to Imgur.");
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
        language_id: 37,
        community_id: communityId,
        nsfw: form.nsfw,
      };

      const res = await lemmyInstance.createPost(prepared);

      setLoading(false);

      dispatch(setPost(res.post_view));

      navigation.pop();
    } catch (e) {
      writeToLog("Error submitting post.");
      writeToLog(e.toString());

      setLoading(false);
      setError(e.toString());
      Alert.alert(e.toString());
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
