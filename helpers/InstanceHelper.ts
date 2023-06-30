import axios from "axios";
import { GetSiteResponse } from "lemmy-js-client";
import { writeToLog } from "./LogHelper";

const getInstanceList = async (): Promise<GetSiteResponse[] | boolean> => {
  try {
    const res = await axios.get("https://memmy.app/instances.json");

    return res.data as GetSiteResponse[];
  } catch (e) {
    writeToLog("Failed to get instance list.");
    writeToLog(e.toString());
    return false;
  }
};

export default getInstanceList;
