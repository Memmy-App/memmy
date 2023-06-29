import React from "react";
import NoResultView, { INoResultViewProps } from "../common/NoResultView";

function NoCommensView({ ...props }: INoResultViewProps) {
  return (
    <NoResultView
      message="No comments yet. Time to do your part 🫡"
      {...props}
    />
  );
}

export default NoCommensView;
