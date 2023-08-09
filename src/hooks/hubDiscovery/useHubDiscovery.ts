import { GetSiteResponse } from "lemmy-js-client";
import { useEffect, useState } from "react";
import axios from "axios";
import { writeToLog } from "@src/helpers/debug/DebugHelper";

interface UseHubDiscovery {
  loading: boolean;
  error: boolean;

  instances: GetSiteResponse[];
}

const useHubDiscovery = (): UseHubDiscovery => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [instances, setInstances] = useState<GetSiteResponse[]>([]);

  useEffect(() => {
    doLoad().then();
  }, []);

  const doLoad = async () => {
    setLoading(true);
    setError(false);

    try {
      const res = await axios.get("https://memmy.app/instances.json");

      setInstances(res.data as GetSiteResponse[]);
    } catch (e: any) {
      writeToLog("Failed to load instance list.");
      writeToLog(e.toString());
    }
  };

  return {
    loading,
    error,

    instances,
  };
};

export default useHubDiscovery;
