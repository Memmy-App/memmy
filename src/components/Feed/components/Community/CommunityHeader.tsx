import React, { useCallback, useMemo } from 'react';
import { Text, useTheme } from 'tamagui';
import { useNavigation, useRoute } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  useCommunityActorId,
  useCommunityAggregates,
  useCommunityBanner,
  useCommunityDescription,
  useCommunityIcon,
  useCommunityName,
  useCommunityNsfw,
} from '@src/state/community/communityStore';
import { getBaseUrl } from '@helpers/links';
import Animated, {
  Extrapolate,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { ChevronLeft, Globe } from '@tamagui/lucide-icons';
import VStack from '@components/Common/Stack/VStack';
import HStack from '@components/Common/Stack/HStack';
import { Skeleton } from 'moti/build/skeleton/native';

const AnimatedAvatarPlaceholder = Animated.createAnimatedComponent(Globe);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const headerPlaceholder = require('../../../../../assets/headerPlaceholder.jpg');

interface IProps {
  isLoading: boolean;
  contentOffsetY: Animated.SharedValue<number>;
}

function CommunityHeader({
  isLoading,
  contentOffsetY,
}: IProps): React.JSX.Element {
  const theme = useTheme();

  const { params } = useRoute<any>();

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const communityName = useCommunityName(params?.id);
  const communityBanner = useCommunityBanner(params?.id);
  const communityNsfw = useCommunityNsfw(params?.id);
  const communityIcon = useCommunityIcon(params?.id);
  const communityCounts = useCommunityAggregates(params?.id);
  const communityDescription = useCommunityDescription(params?.id);
  const communityActorId = useCommunityActorId(params?.id);

  const communityInstance = useMemo(
    () => getBaseUrl(communityActorId),
    [communityActorId],
  );

  const hasParent = navigation.canGoBack();

  const headerContainerStyle = useAnimatedStyle(() => ({
    height: interpolate(
      contentOffsetY.value,
      [0, 180],
      [330, 100],
      Extrapolate.CLAMP,
    ),
  }));

  const bannerStyle = useAnimatedStyle(() => ({
    height: interpolate(
      contentOffsetY.value,
      [0, 200],
      [150, 105],
      Extrapolate.CLAMP,
    ),
    opacity: interpolate(
      contentOffsetY.value,
      [0, 200],
      [1, 0.5],
      Extrapolate.CLAMP,
    ),
  }));

  const avatarStyle = useAnimatedStyle(() => ({
    top: interpolate(
      contentOffsetY.value,
      [0, 100],
      [107, 45],
      Extrapolation.CLAMP,
    ),
    height: interpolate(
      contentOffsetY.value,
      [0, 100],
      [85, 45],
      Extrapolation.CLAMP,
    ),
    width: interpolate(
      contentOffsetY.value,
      [0, 100],
      [85, 45],
      Extrapolation.CLAMP,
    ),
    left: interpolate(
      contentOffsetY.value,
      [0, 100],
      [15, 60],
      Extrapolate.CLAMP,
    ),
  }));

  const headerLabelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      contentOffsetY.value,
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
      )}

      <VStack flex={1} backgroundColor="$fg" marginTop="$1">
        <VStack
          alignItems="center"
          height={300}
          position="absolute"
          width="100%"
          zIndex={-1}
          top={-5}
        >
          {communityBanner != null && !communityNsfw ? (
            <Animated.Image
              source={{ uri: communityBanner }}
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
                {communityName}
              </Text>
            </HStack>
          </Animated.View>
        </VStack>
        <VStack zIndex={1}>
          {communityIcon != null ? (
            <Animated.Image
              source={{ uri: communityIcon }}
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
            <AnimatedAvatarPlaceholder
              size={85}
              color={theme.accent.val}
              style={[{}, avatarStyle]}
            />
          )}
          <VStack marginHorizontal="$3" space="$2.5" top={110}>
            <HStack alignItems="baseline" space="$2">
              <Skeleton>
                <>
                  <Text fontSize="$8" fontWeight="bold">
                    {communityName}
                  </Text>
                  <Text fontSize="$3" color="$secondary">
                    @{communityInstance}
                  </Text>
                </>
              </Skeleton>
            </HStack>
            <HStack space="$3">
              <Text fontSize="$2" color="$secondary" fontWeight="$7">
                {communityCounts?.posts.toLocaleString()} Posts
              </Text>
              <Text fontSize="$2" color="$secondary" fontWeight="$7">
                {communityCounts?.comments.toLocaleString()} Comments
              </Text>
              <Text fontSize="$2" color="$secondary" fontWeight="$7">
                {communityCounts?.subscribers.toLocaleString()} Subscribers
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="$2" color="$color" numberOfLines={2}>
                {communityDescription}
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </VStack>
    </Animated.View>
  );
}

export default React.memo(CommunityHeader);

// function CommunityHeader(): React.JSX.Element | null {
//   const { params } = useRoute<any>();
//   const navigation = useNavigation<NativeStackNavigationProp<any>>();
//
//   // Get the title
//   const communityTitle = useCommunityName(params?.id);
//   const communityBanner = useCommunityBanner(params?.id);
//   const communityNsfw = useCommunityNsfw(params?.id);
//
//   // Load the data
//   const { isLoading, data } = useLoadData<
//     GetCommunityResponse | number | undefined
//   >(
//     async () => {
//       if (params?.id == null) return;
//       return await instance.getCommunity(params?.name);
//     },
//     // We don't want to load the data again if we already have it
//     () => {
//       return communityTitle != null;
//     },
//   );
//
//   // Set the navigation options once we get the community info
//   useEffect(() => {
//     navigation.setOptions({
//       title: communityTitle,
//     });
//   }, [communityTitle]);
//
//   // If we don't have the data and we don't have the ID, then we can't display anything
//   if (params?.name == null || (!isLoading && data == null)) {
//     return null;
//   }
//
//   // Return component
//   return (
//     <VStack backgroundColor="$fg" marginTop="$1">
//       <VStack alignItems="center" position="absolute" width="100%" zIndex={-1}>
//         <Image
//           source={{ uri: communityBanner }}
//           style={{ width: '100%', height: 137, opacity: 0.15 }}
//           contentFit="cover"
//           blurRadius={communityNsfw ? 90 : 3}
//         />
//       </VStack>
//       <VStack padding="$3" space="$2" zIndex={1}>
//         <HStack alignItems="center" space="$3">
//           <CommunityIcon itemId={params.id ?? (data as number)} />
//           <CommunityTitle itemId={params.id ?? (data as number)} />
//         </HStack>
//         <CommunityMetrics itemId={params.id ?? (data as number)} />
//         <CommunityActionBar itemId={params.id ?? (data as number)} />
//       </VStack>
//     </VStack>
//   );
// }
//
// export default React.memo(CommunityHeader);
