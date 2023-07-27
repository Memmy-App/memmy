import React from "react";
import SFIcon from "./icons/SFIcon";
import { ICON_MAP } from "../../constants/IconMap";

interface IProps {
  featured: boolean;
}

function FeaturedIndicator({ featured }: IProps) {
  if (featured) {
    return <SFIcon icon={ICON_MAP.FEATURE_INDICATOR} size={10} boxSize={20} />;
  }

  return null;
}

export default FeaturedIndicator;
