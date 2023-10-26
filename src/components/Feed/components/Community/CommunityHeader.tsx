import React, { useCallback } from 'react';
import { Text, useTheme, View, XStack, YStack } from 'tamagui';
import { useNavigation, useRoute } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  useCommunityBanner,
  useCommunityIcon,
  useCommunityName,
  useCommunityNsfw,
} from '@src/state';
import Animated, {
  Extrapolate,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { ChevronLeft, Globe } from '@tamagui/lucide-icons';
import SortTypeContextMenuButton from '@components/Common/ContextMenu/components/buttons/SortTypeContextMenuButton';
import { SortType } from 'lemmy-js-client';
import CommunityContextMenuButton from '@components/Common/ContextMenu/components/buttons/CommunityContextMenuButton';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const headerPlaceholder = require('../../../../../assets/headerPlaceholder.jpg');
const AnimatedAvatarPlaceholder = Animated.createAnimatedComponent(Globe);

interface IProps {
  isLoading: boolean;
  contentOffsetY: Animated.SharedValue<number>;
  sortType: SortType;
  setSortType: React.Dispatch<React.SetStateAction<SortType>>;
}

function CommunityHeader({
  contentOffsetY,
  sortType,
  setSortType,
}: IProps): React.JSX.Element {
  const theme = useTheme();

  const { params } = useRoute<any>();

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const communityName = useCommunityName(params?.communityId);
  const communityBanner = useCommunityBanner(params?.communityId);
  const communityNsfw = useCommunityNsfw(params?.communityId);
  const communityIcon = useCommunityIcon(params?.communityId);

  const hasParent = navigation.canGoBack();

  const headerContainerStyle = useAnimatedStyle(() => ({
    height: interpolate(
      contentOffsetY.value,
      [0, 180],
      [150, 105],
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
      [110, 45],
      Extrapolation.CLAMP,
    ),
    height: interpolate(
      contentOffsetY.value,
      [0, 100],
      [75, 45],
      Extrapolation.CLAMP,
    ),
    width: interpolate(
      contentOffsetY.value,
      [0, 100],
      [75, 45],
      Extrapolation.CLAMP,
    ),
    left: interpolate(
      contentOffsetY.value,
      [0, 100],
      [25, 60],
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

      <XStack
        mr="auto"
        zIndex={2}
        position="absolute"
        right={10}
        top={50}
        space="$3"
      >
        <View backgroundColor="rgba(0,0,0,0.7)" borderRadius={100} p={4} pr={4}>
          <CommunityContextMenuButton itemId={params?.communityId} />
        </View>
        <View backgroundColor="rgba(0,0,0,0.7)" borderRadius={100} p={4} pr={4}>
          <SortTypeContextMenuButton
            sortType={sortType}
            setSortType={setSortType}
            color="white"
          />
        </View>
      </XStack>

      <YStack flex={1} backgroundColor="$fg" mt="$1">
        <YStack
          alignItems="center"
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
            <XStack space="$2" alignItems="baseline">
              <Text fontSize="$3" fontWeight="bold" numberOfLines={1}>
                {communityName}
              </Text>
            </XStack>
          </Animated.View>
        </YStack>
        <YStack zIndex={2}>
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
              style={[avatarStyle]}
            />
          )}
        </YStack>
      </YStack>
    </Animated.View>
  );
}

export default React.memo(CommunityHeader);
