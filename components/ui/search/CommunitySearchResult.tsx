import React from "react";
import { CommunityView } from "lemmy-js-client";
import { useTheme } from "native-base";

function CommunitySearchResult({ community }: { community: CommunityView }) {
  const theme = useTheme();
}

export default CommunitySearchResult;
