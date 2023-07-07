import moment from "moment";
import axios from "axios";

const clientId = "2969d60a8c6616b";

const imageTypes = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
};

const headers = {
  "Content-Type": "multipart/form-data",
  Accept: "application/json",
  Authorization: `Client-ID ${clientId}`,
};

const uploadToImgur = async (uri: string) => {
  const extension = uri.split(".").pop();

  if (!imageTypes[extension]) {
    throw Error("Invalid image type.");
  }

  const formData = new FormData();
  formData.append("image", {
    uri,
    name: `${moment()}.${extension}`,
    type: imageTypes[extension],
  } as any);

  const res = await axios.post("https://api.imgur.com/3/image", formData, {
    headers,
  });

  return res.data.data.link;
};

export default uploadToImgur;
