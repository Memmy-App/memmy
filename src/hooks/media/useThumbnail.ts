import { getThumbnailAsync } from "expo-video-thumbnails";
import { Dimensions } from "../../components/common/media/common";
import { writeToLog } from "../../helpers/LogHelper";

export interface UseThumbnail {
  uri: string;
  dimensions: Dimensions;
}

/**
 * A function that generates a thumbnail from a video URI and returns the URI and dimensions of the thumbnail. Returns an empty string and 0x0 dimensions if the thumbnail could not be generated. This function is async and should be used in a useEffect hook and the uri should be memoized.
 * @param uri The URI to pass to generate the thumbnail from
 * @param headers The headers to pass to the request if it's a remote URI
 * @returns An object with the uri and dimensions of the thumbnail
 */
const useThumbnail = async (
  uri: string,
  headers?: Record<string, string>
): Promise<UseThumbnail> => {
  try {
    const computedThumbnail = await getThumbnailAsync(uri, {
      time: 1,
      quality: 0.75, // Follow NextJS's default quality
      headers,
    });

    return {
      uri: computedThumbnail.uri,
      dimensions: {
        height: computedThumbnail.height,
        width: computedThumbnail.width,
      },
    };
  } catch (e) {
    writeToLog(
      `Encountered problem generating thumbnail for video with error:\n${e.toString()}`
    );

    return {
      uri: "",
      dimensions: {
        height: 0,
        width: 0,
      },
    };
  }
};

export default useThumbnail;
