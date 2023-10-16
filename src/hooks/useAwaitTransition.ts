import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface UseAwaitTransition {
  transitioning: boolean;
}

export const useAwaitTransition = (): UseAwaitTransition => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [transitioning, setTransitioning] = useState(true);
  const transitionFinished = useRef(false);

  // This allows us to mount the screen before processing the comments for a smooth transition
  useEffect(() => {
    // Create our listener
    const unsubscribe = navigation.addListener('transitionEnd', (e) => {
      if (transitionFinished.current) return;

      // Update the state
      setTransitioning(false);
      transitionFinished.current = true;
    });

    return unsubscribe;
  }, [navigation]);

  return { transitioning };
};
