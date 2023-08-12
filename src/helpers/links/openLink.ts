import { useToastStore } from "@src/state/toast/toastStore";
import i18n from "i18next";
import { writeToLog } from "@src/helpers/debug/DebugHelper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { isPotentialFed } from "@src/helpers/links/isPotentialFed";
import { isLemmySite } from "@src/helpers/links/isLemmySite";
import { openLemmyLink } from "@src/helpers/links/openLemmyLink";
import { openWebLink } from "@src/helpers/links/openWebLink";

export const openLink = (
  link: string,
  navigation: NativeStackNavigationProp<any>,
  color = "#000"
): void => {
  const urlPattern =
    /(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])/;

  writeToLog(`Trying to open link: ${link}`);

  if (!urlPattern.test(link)) {
    useToastStore.getState().actions.showToast({
      message: i18n.t("toast.linkError"),
      duration: 3000,
      variant: "error",
    });
    return;
  }

  const match = link.match(urlPattern);
  if (!match) return;

  link = match[0];

  const potentialFed = isPotentialFed(link);
  if (potentialFed) {
    isLemmySite(link)
      .then((isLemmy) => {
        if (isLemmy) {
          openLemmyLink(link, navigation, color);
        } else {
          openWebLink(link, color);
        }
      })
      .catch(() => {
        openWebLink(link, color);
      });
  } else {
    openWebLink(link, color);
  }
};
