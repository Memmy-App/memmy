import { GetSiteResponse } from 'lemmy-js-client';
import axios from 'axios';
import { writeToLog } from '@helpers/LogHelper';

export default async (): Promise<GetSiteResponse[]> => {
  try {
    const res = await axios.get('https://memmy.app/instances.json');

    return res.data as GetSiteResponse[];
  } catch (e: any) {
    writeToLog('Failed to get instance list.');
    writeToLog(e.toString());
    throw e;
  }
};
