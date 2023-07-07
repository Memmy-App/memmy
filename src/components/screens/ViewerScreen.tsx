import React from "react";
import WebView from "react-native-webview";

const licenseHtml = require("../../assets/license.html");
const licenseTxt = require("../../assets/license2.html");
const terms = require("../../assets/terms.html");

interface IProps {
  route: any;
}

function ViewerScreen({ route }: IProps) {
  let source;

  if (route.params.type === "acknowledgements") {
    source = licenseHtml;
  } else if (route.params.type === "license") {
    source = licenseTxt;
  } else if (route.params.type === "terms") {
    source = terms;
  } else if (route.params.type === "privacy") {
    source = {
      uri: "https://memmy.app/privacy.txt",
    };
  }

  return <WebView source={source} originWhitelist={["*"]} />;
}

export default ViewerScreen;
