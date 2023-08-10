import React from "react";
import { SFIcon } from "@src/components/common/icons/SFIcon";
import { ICON_MAP } from "@src/types/constants/IconMap";

interface IProps {
  featured: boolean;
}

function FeaturedIndicator({ featured }: IProps) {
  if (featured) {
    return <SFIcon icon={ICON_MAP.FEATURE_INDICATOR} size={10} boxSize={20} />;
  }

  return null;
}

export default React.memo(FeaturedIndicator);
