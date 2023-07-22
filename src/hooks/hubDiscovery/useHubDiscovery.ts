import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { GetSiteResponse } from "lemmy-js-client";
import { useTranslation } from "react-i18next";
import getInstanceList from "../../helpers/InstanceHelper";

interface UseHubDiscovery {
  loading: boolean;
  error: boolean;

  instances: GetSiteResponse[];
}

const useHubDiscovery = (): UseHubDiscovery => {
  const { t } = useTranslation();

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

      Alert.alert(
        t("alert.title.error"),
        t("alert.message.errorFetchingInstanceList"),
        [
          {
            text: t("Cancel"),
            style: "cancel",
          },
          {
            text: t("Retry"),
            style: "default",
            onPress: doLoad,
          },
        ]
      );

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
