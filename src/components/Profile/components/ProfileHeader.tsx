import React, { useMemo } from 'react';
import VStack from '@components/Common/Stack/VStack';
import {
  useProfileActorId,
  useProfileAvatar,
  useProfileBanner,
  useProfileBio,
  useProfileCounts,
  useProfileName,
} from '@src/state/profile/profileStore';
import SuspenseImage from '@components/Common/Suspense/SuspenseImage';
import { Text, useTheme } from 'tamagui';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HStack from '@components/Common/Stack/HStack';
import { getBaseUrl } from '@helpers/links';

interface IProps {
  profileId: number;
}

function ProfileHeader({ profileId }: IProps): React.JSX.Element {
  const theme = useTheme();

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

  return (
    <VStack backgroundColor="$fg" marginTop="$1" height={300}>
      <VStack
        alignItems="center"
        height={300}
        position="absolute"
        width="100%"
        zIndex={-1}
      >
        <SuspenseImage
          source={{ uri: personBanner }}
          style={{ width: '100%', height: 150, opacity: 0.5 }}
          contentFit="cover"
        />
        <VStack position="absolute" top={80}>
          <Text>Hello</Text>
        </VStack>
      </VStack>
      <VStack space="$2" zIndex={1} marginTop={107}>
        <SuspenseImage
          source={{ uri: personAvatar }}
          style={{
            width: 85,
            height: 85,
            borderRadius: 100,
            borderColor: theme.bg.val,
            borderWidth: 4,
            marginLeft: 15,
          }}
        />
        <VStack marginHorizontal="$3" space="$2.5">
          <HStack alignItems="baseline" space="$2">
            <Text fontSize="$8" fontWeight="bold">
              {personName}
            </Text>
            <Text fontSize="$3" color="$secondary">
              @{personInstance}
            </Text>
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
  );
}

export default React.memo(ProfileHeader);
