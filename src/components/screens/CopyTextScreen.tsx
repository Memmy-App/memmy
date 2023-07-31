import React, { useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { VStack } from "@src/components/common/Gluestack";
import { Button, StyleSheet, TextInput } from "react-native";

interface IProps {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

function CopyTextScreen({ navigation, route }: IProps) {
  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerLeft: () => (
        <Button title="Back" onPress={() => navigation.pop()} />
      ),
    });
  }, []);

  return (
    <VStack flex={1}>
      <TextInput
        multiline
        style={styles.copyTextInput}
        value={route.params.text}
        editable={false}
      />
    </VStack>
  );
}

const styles = StyleSheet.create({
  copyTextInput: {
    height: "100%",
  },
});

export default CopyTextScreen;
