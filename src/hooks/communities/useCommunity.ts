import React, { useEffect } from "react";
import { CommunityModeratorView, CommunityView } from "lemmy-js-client";
import { lemmyAuthToken, lemmyInstance } from "../../LemmyInstance";
import { handleLemmyError } from "../../helpers/LemmyErrorHelper";

interface UseCommunity {
  community: CommunityView | null;
  moderators: CommunityModeratorView[] | [];
  setCommunity: React.Dispatch<React.SetStateAction<CommunityView | null>>;
  communityLoading: boolean;
  communityError: boolean;
  communityNotFound: boolean;

  doLoad: (refresh?: boolean) => void;

  loaded: boolean;
  setLoaded: React.Dispatch<React.SetStateAction<any>>;
}

const useCommunity = (communityID: number): UseCommunity => {
  // State
  const [community, setCommunity] = React.useState<CommunityView | null>(null);
  const [moderators, setModerators] = React.useState<CommunityModeratorView[]>(
    []
  );
  const [communityLoading, setCommunityLoading] =
    React.useState<boolean>(false);
  const [communityError, setCommunityError] = React.useState<boolean>(false);
  const [communityNotFound, setCommunityNotFound] =
    React.useState<boolean>(false);
  const [loaded, setLoaded] = React.useState(false);

  useEffect(() => {
    if (!communityID) return;

    if (lemmyInstance) {
      doLoad(true).then();
    }
  }, [communityID]);

  const doLoad = async (refresh = false) => {
    const loadCommunity = async () => {
      setCommunityLoading(true);
      setCommunityError(false);

      try {
        const res = await lemmyInstance?.getCommunity({
          auth: lemmyAuthToken,
          id:
            typeof communityID === "number"
              ? (communityID as number)
              : undefined,
        });

        setCommunity(res.community_view);
        setModerators(res.moderators);
        setCommunityLoading(false);
      } catch (e) {
        setCommunityLoading(false);
        setCommunityError(true);

        if (e.toString() === "couldnt_find_community") {
          setCommunityNotFound(true);
        }

        handleLemmyError(e.toString());
      }
      setLoaded(true);
    };

    if (communityID && (refresh || !community)) {
      loadCommunity().then();
    }
  };

  return {
    community,
    moderators,
    setCommunity,

    communityLoading,
    communityError,
    communityNotFound,

    doLoad,

    loaded,
    setLoaded,
  };
};

export default useCommunity;
