import { ListingType } from "lemmy-js-client";

export const listingTypeOptions: Record<
  ListingType,
  { display: string; icon: string }
> = {
  All: {
    display: "All",
    icon: "globe",
  },
  Local: {
    display: "Local",
    icon: "location",
  },
  Subscribed: {
    display: "Subscribed",
    icon: "heart",
  },
};
