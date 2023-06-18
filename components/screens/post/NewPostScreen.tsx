import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Input } from "native-base";

function NewPostScreen() {
  return (
    <KeyboardAwareScrollView>
      <Input />
    </KeyboardAwareScrollView>
  );
}

export default NewPostScreen;
