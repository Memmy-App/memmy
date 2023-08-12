export const isPotentialFed = (link: string): boolean => {
  const fedPattern =
    /^(?:https?:\/\/(?:\w+.)?\w+.\w+)?\/(?:c|m|u|post)\/\w+(?:@\w+(?:.\w+)?(?:.\w+)?)?$/;
  return fedPattern.test(link);
};
