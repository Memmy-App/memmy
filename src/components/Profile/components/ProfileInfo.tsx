import React, { useMemo } from 'react';
import { Text, XStack, YStack } from 'tamagui';
import {
  useProfileActorId,
  useProfileBio,
  useProfileCounts,
  useProfileName,
} from '@src/state';
import { useProfileScreenContext } from '@components/Profile/screens/ProfileScreen';
import { getBaseUrl } from '@helpers/links';
import ProfileTopTabs from '@components/Profile/components/Tabs/ProfileTopTabs';

function ProfileHeader(): React.JSX.Element {
  const { profileId } = useProfileScreenContext();
  const personName = useProfileName(profileId);
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
    <>
      <YStack mx="$3" space="$2.5" pt="$5">
        <YStack space="$0.5">
          <Text fontSize="$5" fontWeight="bold">
            {personName}
          </Text>
          <Text fontSize="$3" color="$secondary">
            @{personInstance}
          </Text>
        </YStack>
        <XStack space="$3">
          <Text fontSize="$2" color="$secondary" fontWeight="$7">
            {personCounts?.post_count.toLocaleString()} Posts
          </Text>
          <Text fontSize="$2" color="$secondary" fontWeight="$7">
            {personCounts?.comment_count.toLocaleString()} Comments
          </Text>
          <Text fontSize="$2" color="$secondary" fontWeight="$7">
            {totalScore} Total Score
          </Text>
        </XStack>
        <XStack>
          <Text fontSize="$3" color="$color" numberOfLines={2}>
            {personBio}
          </Text>
        </XStack>
      </YStack>
      <ProfileTopTabs />
    </>
  );
}

export default React.memo(ProfileHeader);
