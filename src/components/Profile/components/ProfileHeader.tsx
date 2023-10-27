import React, { useCallback, useMemo } from 'react';
import { Text, useTheme, View, XStack, YStack } from 'tamagui';
import {
  useProfileActorId,
  useProfileAvatar,
  useProfileBanner,
  useProfileName,
} from '@src/state';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getBaseUrl } from '@helpers/links';
import Animated, {
  Extrapolate,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useProfileScreenContext } from '@components/Profile/screens/ProfileScreen';
import { ChevronLeft, User } from '@tamagui/lucide-icons';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const headerPlaceholder = require('../../../../assets/headerPlaceholder.jpg');

const AnimatedAvatarPlaceholder = Animated.createAnimatedComponent(User);

function ProfileHeader(): React.JSX.Element {
  const theme = useTheme();

  const { profileId, contentOffsetY } = useProfileScreenContext();

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const personName = useProfileName(profileId);
  const personBanner = useProfileBanner(profileId);
  const personAvatar = useProfileAvatar(profileId);
  const personActorId = useProfileActorId(profileId);

  const hasParent = navigation.canGoBack();

  const personInstance = useMemo(
    () => getBaseUrl(personActorId),
    [personActorId],
  );

  const headerContainerStyle = useAnimatedStyle(() => ({
    height: interpolate(
      contentOffsetY!.value,
      [0, 180],
      [150, 105],
      Extrapolate.CLAMP,
    ),
  }));

  const bannerStyle = useAnimatedStyle(() => ({
    height: interpolate(
      contentOffsetY!.value,
      [0, 200],
      [150, 105],
      Extrapolate.CLAMP,
    ),
    opacity: interpolate(
      contentOffsetY!.value,
      [0, 200],
      [1, 0.5],
      Extrapolate.CLAMP,
    ),
  }));

  const avatarStyle = useAnimatedStyle(() => ({
    top: interpolate(
      contentOffsetY!.value,
      [0, 200],
      [110, 45],
      Extrapolation.CLAMP,
    ),
    height: interpolate(
      contentOffsetY!.value,
      [0, 200],
      [75, 45],
      Extrapolation.CLAMP,
    ),
    width: interpolate(
      contentOffsetY!.value,
      [0, 200],
      [75, 45],
      Extrapolation.CLAMP,
    ),
    left: interpolate(
      contentOffsetY!.value,
      [0, 200],
      [25, 60],
      Extrapolate.CLAMP,
    ),
  }));

  const headerLabelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      contentOffsetY!.value,
      [0, 150],
      [0, 1],
      Extrapolate.CLAMP,
    ),
  }));

  const onBackPress = useCallback(() => {
    navigation.pop();
  }, []);

  return (
    <Animated.View style={[headerContainerStyle]}>
      {hasParent && (
        <View
          zIndex={2}
          position="absolute"
          top={50}
          left={10}
          backgroundColor="rgba(0,0,0,0.7)"
          borderRadius={100}
          p={2}
          pr={4}
          onPress={onBackPress}
          hitSlop={2}
        >
          <ChevronLeft color="white" size={30} />
        </View>
      )}

      <YStack flex={1} backgroundColor="$fg" mt="$1">
        <YStack
          alignItems="center"
          position="absolute"
          width="100%"
          zIndex={-1}
          top={-5}
        >
          {personBanner != null ? (
            <Animated.Image
              source={{ uri: personBanner }}
              style={[{ width: '100%' }, bannerStyle]}
              resizeMode="cover"
            />
          ) : (
            <Animated.Image
              source={headerPlaceholder}
              style={[{ width: '100%' }, bannerStyle]}
              resizeMode="cover"
            />
          )}

          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 55,
                left: 130,
                right: '10%',
              },
              headerLabelStyle,
            ]}
          >
            <XStack space="$2" alignItems="baseline">
              <Text fontSize="$5" fontWeight="bold" numberOfLines={1}>
                {personName}
              </Text>
              <Text fontSize="$3" color="$secondary">
                @{personInstance}
              </Text>
            </XStack>
          </Animated.View>
        </YStack>
        <YStack zIndex={2}>
          {personAvatar != null ? (
            <Animated.Image
              source={{ uri: personAvatar }}
              style={[
                {
                  borderRadius: 100,
                  borderColor: theme.bg.val,
                  borderWidth: 2,
                },
                avatarStyle,
              ]}
            />
          ) : (
            <AnimatedAvatarPlaceholder size={85} style={[avatarStyle]} />
          )}
        </YStack>
      </YStack>
    </Animated.View>
  );
}

export default React.memo(ProfileHeader);
