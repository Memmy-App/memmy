import React, { useCallback, useMemo } from 'react';
import VStack from '@components/Common/Stack/VStack';
import {
  useProfileActorId,
  useProfileAvatar,
  useProfileBanner,
  useProfileBio,
  useProfileCounts,
  useProfileName,
} from '@src/state/profile/profileStore';
import { Text, useTheme } from 'tamagui';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HStack from '@components/Common/Stack/HStack';
import { getBaseUrl } from '@helpers/links';
import Animated, {
  Extrapolate,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useProfileScreenContext } from '@components/Profile/screens/ProfileScreen';
import { ChevronLeft } from '@tamagui/lucide-icons';
import { Pressable } from 'react-native';
import { Skeleton } from 'moti/build/skeleton/native';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const headerPlaceholder = require('../../../../assets/headerPlaceholder.jpg');

function ProfileHeader(): React.JSX.Element {
  const theme = useTheme();

  const { profileId, contentOffsetY, isLoading } = useProfileScreenContext();

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const personName = useProfileName(profileId);
  const personBanner = useProfileBanner(profileId);
  const personAvatar = useProfileAvatar(profileId);
  const personActorId = useProfileActorId(profileId);
  const personCounts = useProfileCounts(profileId);
  const personBio = useProfileBio(profileId);

  const personInstance = useMemo(
    () => getBaseUrl(personActorId),
    [personActorId],
  );

  const totalScore = useMemo(
    () =>
      (
        (personCounts?.comment_score ?? 0) + (personCounts?.post_score ?? 0)
      ).toLocaleString(),
    [personCounts?.comment_score, personCounts?.post_score],
  );

  const headerContainerStyle = useAnimatedStyle(() => ({
    height: interpolate(
      contentOffsetY!.value,
      [0, 125],
      [310, 100],
      Extrapolate.CLAMP,
    ),
  }));

  const bannerStyle = useAnimatedStyle(() => ({
    height: interpolate(
      contentOffsetY!.value,
      [0, 150],
      [150, 100],
      Extrapolate.CLAMP,
    ),
    opacity: interpolate(
      contentOffsetY!.value,
      [0, 150],
      [1, 0.5],
      Extrapolate.CLAMP,
    ),
  }));

  const avatarStyle = useAnimatedStyle(() => ({
    top: interpolate(
      contentOffsetY!.value,
      [0, 150],
      [107, 45],
      Extrapolation.CLAMP,
    ),
    height: interpolate(
      contentOffsetY!.value,
      [0, 150],
      [85, 45],
      Extrapolation.CLAMP,
    ),
    width: interpolate(
      contentOffsetY!.value,
      [0, 150],
      [85, 45],
      Extrapolation.CLAMP,
    ),
    left: interpolate(
      contentOffsetY!.value,
      [0, 150],
      [15, 60],
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
      <Pressable
        style={{
          zIndex: 2,
          position: 'absolute',
          top: 50,
          left: 10,
          backgroundColor: 'black',
          borderRadius: 100,
          opacity: 0.6,
          padding: 2,
          paddingRight: 4,
        }}
        onPress={onBackPress}
      >
        <ChevronLeft color="white" size={30} />
      </Pressable>

      <VStack flex={1} backgroundColor="$fg" marginTop="$1">
        <VStack
          alignItems="center"
          height={300}
          position="absolute"
          width="100%"
          zIndex={-1}
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
            <HStack space="$2" alignItems="baseline">
              <Text fontSize="$8" fontWeight="bold" numberOfLines={1}>
                {personName}
              </Text>
              <Text fontSize="$3" color="$secondary">
                @{personInstance}
              </Text>
            </HStack>
          </Animated.View>
        </VStack>
        <VStack zIndex={1}>
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
          <VStack marginHorizontal="$3" space="$2.5" top={110}>
            <HStack alignItems="baseline" space="$2">
              <Skeleton>
                <>
                  <Text fontSize="$8" fontWeight="bold">
                    {personName}
                  </Text>
                  <Text fontSize="$3" color="$secondary">
                    @{personInstance}
                  </Text>
                </>
              </Skeleton>
            </HStack>
            <HStack space="$3">
              <Text fontSize="$4" color="$secondary" fontWeight="bold">
                {personCounts?.post_count.toLocaleString()} Posts
              </Text>
              <Text fontSize="$4" color="$secondary" fontWeight="bold">
                {personCounts?.comment_count.toLocaleString()} Comments
              </Text>
              <Text fontSize="$4" color="$secondary" fontWeight="bold">
                {totalScore} Total Score
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="$5" color="$color" numberOfLines={2}>
                {personBio}
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </VStack>
    </Animated.View>
  );
}

export default React.memo(ProfileHeader);
