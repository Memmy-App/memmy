export const isUrl = (link?: string): boolean => {
  if (link == null) return false;

  const pattern =
    /(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])/;

  return pattern.test(link);
};
