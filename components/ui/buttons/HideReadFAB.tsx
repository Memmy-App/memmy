import React from 'react';
import Animated from 'react-native-reanimated';
import { FAB } from 'react-native-elements';
import { useTheme } from "native-base";

import { FadeOutDown, FadeInDown } from 'react-native-reanimated';

interface HideReadFABProps {
  onPress: () => void;
}

function HideReadFAB( src: HideReadFABProps ) {

  const theme = useTheme();

  return (
    <Animated.View
      exiting={FadeOutDown.duration(500)}
      entering={FadeInDown.duration(500)}
      style={{zIndex: 100}}
    >
      <FAB 
          // title="Create" 
          placement="right"
          size="large"
          color={theme.colors.app.accent}
          icon={{ name: "eye-with-line", type: "entypo" }}
          onPress={src.onPress}
        />
      </Animated.View>
  );
};


export default HideReadFAB; 