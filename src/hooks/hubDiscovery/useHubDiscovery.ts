import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { GetSiteResponse } from "lemmy-js-client";
import getInstanceList from "../../helpers/InstanceHelper";

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

    const res = await getInstanceList();

    setLoading(false);

    if (!res) {
      setError(true);

      Alert.alert("Error", "Error fetching instance list. Try again?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Retry",
          style: "default",
          onPress: doLoad,
        },
      ]);

      return;
    }

    setInstances(res as GetSiteResponse[]);
  };

  return {
    loading,
    error,

    instances,
  };
};

export default useHubDiscovery;
