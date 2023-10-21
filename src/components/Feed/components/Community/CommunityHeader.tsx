import React, { useCallback, useMemo } from 'react';
import { Text, useTheme, View, XStack, YStack } from 'tamagui';
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
  useCommunitySubscribed,
} from '@src/state';
import { getBaseUrl } from '@helpers/links';
import Animated, {
  Extrapolate,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {
  ChevronLeft,
  Globe,
  Star,
  StarOff,
  StickyNote,
} from '@tamagui/lucide-icons';
import SortTypeContextMenuButton from '@components/Common/ContextMenu/components/buttons/SortTypeContextMenuButton';
import { SortType } from 'lemmy-js-client';
import ButtonOne from '@components/Common/Button/ButtonOne';
import { isSubscribed } from '@helpers/lemmy';
import instance from '@src/Instance';
import { useLoadData } from '@src/hooks';

const AnimatedAvatarPlaceholder = Animated.createAnimatedComponent(Globe);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const headerPlaceholder = require('../../../../../assets/headerPlaceholder.jpg');

interface IProps {
  isLoading: boolean;
  contentOffsetY: Animated.SharedValue<number>;
  sortType: SortType;
  setSortType: React.Dispatch<React.SetStateAction<SortType>>;
}

function CommunityHeader({
  isLoading,
  contentOffsetY,
  sortType,
  setSortType,
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
  const communitySubscribed = useCommunitySubscribed(params?.id);

  const subscribed = useMemo(
    () => isSubscribed(communitySubscribed),
    [communitySubscribed],
  );

  const { isLoading: isSubscribing, refresh: submit } = useLoadData();

  const onSubscribePress = useCallback(() => {
    submit(async () => {
      void instance.subscribeCommunity(params.id!, !subscribed).then(() => {});
    });
  }, [subscribed]);

  const communityInstance = useMemo(
    () => getBaseUrl(communityActorId),
    [communityActorId],
  );

  const onNewPostPress = useCallback(() => {
    navigation.push('NewPost', { communityId: params?.id });
  }, []);

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

      <XStack mr="auto" zIndex={2} position="absolute" right={10} top={50}>
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
            <XStack space="$2" alignItems="baseline">
              <Text fontSize="$3" fontWeight="bold" numberOfLines={1}>
                {communityName}
              </Text>
            </XStack>
          </Animated.View>
        </YStack>
        <YStack zIndex={1}>
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
          <XStack ml="auto" width="65%" top={70} space="$3" right={10}>
            <ButtonOne
              label={subscribed ? 'Subscribed' : 'Subscribe'}
              icon={subscribed ? Star : StarOff}
              onPress={onSubscribePress}
              disabled={isSubscribing}
            />
            <ButtonOne
              label="New Post"
              icon={StickyNote}
              onPress={onNewPostPress}
            />
          </XStack>

          <YStack mx="$3" space="$2.5" top={80}>
            <YStack alignItems="baseline" space="$0.5">
              <Text fontSize="$5" fontWeight="bold">
                {communityName}
              </Text>
              <Text fontSize="$3" color="$secondary">
                @{communityInstance}
              </Text>
            </YStack>
            <XStack space="$3">
              <Text fontSize="$2" color="$secondary" fontWeight="$7">
                {communityCounts?.posts.toLocaleString()} Posts
              </Text>
              <Text fontSize="$2" color="$secondary" fontWeight="$7">
                {communityCounts?.comments.toLocaleString()} Comments
              </Text>
              <Text fontSize="$2" color="$secondary" fontWeight="$7">
                {communityCounts?.subscribers.toLocaleString()} Subscribers
              </Text>
            </XStack>
            <XStack>
              <Text fontSize="$3" color="$color" numberOfLines={2}>
                {communityDescription}
              </Text>
            </XStack>
          </YStack>
        </YStack>
      </YStack>
    </Animated.View>
  );
}

export default React.memo(CommunityHeader);
