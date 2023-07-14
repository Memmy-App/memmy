import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { View, Text } from "native-base";

interface IProps {
  onPress: () => void;
  visible: boolean;
}

function ImageExitButton({ onPress, visible }: IProps) {
  return (
    <View opacity={visible ? 1 : 0}>
      <Pressable onPress={onPress}>
        <View style={[styles.buttonPosition, styles.exitButton]} />
        <Text style={[styles.buttonPosition, styles.buttonText]}>X</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonPosition: {
    position: "absolute",
    top: 40,
    bottom: 0,
    right: 10,
  },

  exitButton: {
    backgroundColor: "gray",
    color: "white",
    opacity: 0.5,
    padding: 14,
    borderRadius: 100,
    zIndex: -1,
  },

  buttonText: {
    color: "white",
    zIndex: 3,
  },
});

export default ImageExitButton;
