import React from "react";
import { Modal, StyleSheet, View } from "react-native";
import { Spinner } from "@src/components/gluestack";

interface IProps {
  loading: boolean;
}

function LoadingModal({ loading }: IProps): React.JSX.Element {
  return (
    <Modal visible={loading} transparent>
      <View style={styles.wrapper}>
        <View
          style={[styles.container, styles.horizontal, styles.loaderContainer]}
        >
          <Spinner size="large" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 9,
    backgroundColor: "rgba(0,0,0,0.6)",
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  loaderContainer: {
    width: 90,
    height: 90,
    backgroundColor: "white",
    borderRadius: 15,
    position: "absolute",
    left: "50%",
    top: "50%",
    marginLeft: -45,
    marginTop: -45,
    opacity: 0.8,
  },
});
export default LoadingModal;
