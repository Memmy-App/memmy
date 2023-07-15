import React from "react";
import { StyleSheet } from "react-native";
import { View, Pressable } from "native-base";
import { IconX } from "tabler-icons-react-native";

interface IProps {
  onPress: () => void;
  visible: boolean;
}

function ImageExitButton({ onPress, visible }: IProps) {
  return (
    <View
      style={[
        styles.buttonPosition,
        {
          opacity: visible ? 0.5 : 0,
        },
      ]}
    >
      <Pressable onPress={onPress} hitSlop={10} padding={1.5}>
        <View>
          <IconX color="white" />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonPosition: {
    position: "absolute",
    top: 45,
    right: 10,
    backgroundColor: "gray",
    borderRadius: 100,
  },

  buttonText: {
    color: "white",
  },
});

export default ImageExitButton;
