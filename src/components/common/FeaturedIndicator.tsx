import React from "react";
import SFIcon from "./icons/SFIcon";

interface IProps {
  featured: boolean;
}

function FeaturedIndicator({ featured }: IProps) {
  if (featured) {
    return (
      <SFIcon icon="pin.fill" size={10} style={{ width: 20, height: 20 }} />
    );
  }

  return null;
}

export default FeaturedIndicator;
